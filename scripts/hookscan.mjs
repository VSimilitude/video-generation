// Precise AST scan for React hooks-order violations.
// Flags, per function body:
//   (A) a hook call reached through a conditional/loop/callback path inside that body
//   (B) a hook call positioned after an early `return` (a return that is not the
//       function body's final statement)
import ts from "/home/mike/projects/video_generation/node_modules/typescript/lib/typescript.js";
import fs from "fs";
import path from "path";

// With no arguments, sweep the whole source tree. `npm run lint:hooks` passes
// none, and a scan of zero files reporting "0 finding(s)" is a gate that always
// passes — which is exactly the failure mode this scanner exists to catch.
function sweep(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) sweep(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const args = process.argv.slice(2);
const files = args.length ? args : sweep("src").sort();
const isHookName = (n) => /^use[A-Z]/.test(n);

function hookCallName(node) {
  if (!ts.isCallExpression(node)) return null;
  const e = node.expression;
  if (ts.isIdentifier(e) && isHookName(e.text)) return e.text;
  if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.name) && isHookName(e.name.text))
    return e.name.text;
  return null;
}

const isFnLike = (n) =>
  ts.isFunctionDeclaration(n) ||
  ts.isArrowFunction(n) ||
  ts.isFunctionExpression(n) ||
  ts.isMethodDeclaration(n);

let total = 0;

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings = [];

  const visit = (node) => {
    if (isFnLike(node) && node.body) {
      analyzeFn(node, sf, findings);
    }
    ts.forEachChild(node, visit);
  };

  function analyzeFn(fn, sf, out) {
    const body = fn.body;
    const hookCalls = [];

    // Collect hook calls whose nearest enclosing function is `fn`.
    const walk = (n, path) => {
      const name = hookCallName(n);
      if (name) hookCalls.push({ node: n, name, path: [...path] });
      ts.forEachChild(n, (c) => {
        if (isFnLike(c)) return; // belongs to a nested function
        walk(c, [...path, n]);
      });
    };
    ts.forEachChild(body, (c) => {
      if (isFnLike(c)) return;
      walk(c, [body]);
    });
    if (!hookCalls.length) return;

    const fnLabel = describeFn(fn, sf);

    // (A) conditional reachability
    for (const { node, name, path } of hookCalls) {
      const reasons = [];
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const child = i + 1 < path.length ? path[i + 1] : node;
        if (ts.isConditionalExpression(p) && (p.whenTrue === child || p.whenFalse === child))
          reasons.push("ternary branch");
        else if (
          ts.isBinaryExpression(p) &&
          (p.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
            p.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
            p.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) &&
          p.right === child
        )
          reasons.push("short-circuit rhs");
        else if (ts.isIfStatement(p) && p.expression !== child) reasons.push("if branch");
        else if (
          ts.isForStatement(p) ||
          ts.isForOfStatement(p) ||
          ts.isForInStatement(p) ||
          ts.isWhileStatement(p) ||
          ts.isDoStatement(p)
        )
          reasons.push("loop body");
        else if (ts.isCaseClause(p) || ts.isDefaultClause(p)) reasons.push("switch case");
        else if (ts.isTryStatement(p) || ts.isCatchClause(p)) reasons.push("try/catch");
      }
      if (reasons.length) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        out.push({
          line: line + 1,
          kind: "CONDITIONAL-HOOK",
          detail: `${name}() reached via ${[...new Set(reasons)].join(" > ")} in ${fnLabel}`,
          text: node.getText(sf).slice(0, 120),
        });
      }
    }

    // (B) early return before a hook call
    if (ts.isBlock(body)) {
      const stmts = body.statements;
      const lastIdx = stmts.length - 1;
      const earlyReturns = [];
      stmts.forEach((s, i) => {
        const collect = (n) => {
          if (isFnLike(n)) return;
          if (ts.isReturnStatement(n)) earlyReturns.push(n);
          ts.forEachChild(n, collect);
        };
        if (ts.isReturnStatement(s)) {
          if (i !== lastIdx) earlyReturns.push(s);
        } else collect(s);
      });
      for (const ret of earlyReturns) {
        const retEnd = ret.getEnd();
        for (const { node, name } of hookCalls) {
          if (node.getStart(sf) > retEnd) {
            const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
            const rl = sf.getLineAndCharacterOfPosition(ret.getStart(sf)).line + 1;
            out.push({
              line: line + 1,
              kind: "EARLY-RETURN-BEFORE-HOOK",
              detail: `${name}() runs after an early return at line ${rl} in ${fnLabel}`,
              text: node.getText(sf).slice(0, 120),
            });
          }
        }
      }
    }
  }

  function describeFn(fn, sf) {
    let name = fn.name?.text;
    if (!name && fn.parent && ts.isVariableDeclaration(fn.parent)) name = fn.parent.name.getText(sf);
    if (!name && fn.parent && ts.isPropertyAssignment(fn.parent)) name = fn.parent.name.getText(sf);
    const { line } = sf.getLineAndCharacterOfPosition(fn.getStart(sf));
    return `${name ?? "<anon>"} (line ${line + 1})`;
  }

  visit(sf);

  if (findings.length) {
    // dedupe
    const seen = new Set();
    const uniq = findings.filter((f) => {
      const k = f.line + f.kind + f.detail;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    console.log("\n=== " + file);
    for (const f of uniq.sort((a, b) => a.line - b.line)) {
      console.log(`  L${f.line} [${f.kind}] ${f.detail}`);
      console.log(`        ${f.text.replace(/\s+/g, " ")}`);
      total++;
    }
  }
}
console.log(`\n--- ${total} finding(s) ---`);
