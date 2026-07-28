// Service worker for the player site.
//
// Two jobs:
//   1. Make the app shell (index.html + bundle.js + icons) work offline, so an
//      installed home-screen copy opens on a plane or in a car park.
//   2. Cache the narration and background assets as they are played, so the
//      second watch of an episode costs nothing.
//
// VERSION is injected by scripts/build-site.mjs (a hash of the built bundle
// and index.html). It names the shell cache, so a deploy writes a brand-new
// cache, `skipWaiting` + `clients.claim` hand control straight over, and the
// previous version's cache is deleted on activate. The runtime (media) cache is
// deliberately NOT versioned: 20-odd MB of audio should survive a code change.
//
// Everything is scope-relative. The site is served from a repo subpath on
// GitHub Pages (/video-generation/), so nothing here may start with "/".

const VERSION = "__BUILD_VERSION__";
const SHELL_CACHE = `vg-shell-${VERSION}`;
const RUNTIME_CACHE = "vg-runtime-v1";

/**
 * Cap on cached media entries. The suite is a few hundred small mp3s and webp
 * plates; this keeps a phone from hoarding every episode ever deployed.
 */
const RUNTIME_MAX_ENTRIES = 200;

const SHELL = [
  "./",
  "./index.html",
  "./bundle.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon-180.png",
];

const SHELL_URLS = new Set(SHELL.map((path) => new URL(path, self.location.href).href));

/** Narration clips and painted plates: everything the compositions stream. */
function isRuntimeAsset(url) {
  return /(^|\/)(narration|backgrounds)\//.test(url.pathname);
}

// --- Install / activate -----------------------------------------------------

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // One at a time rather than addAll(): addAll is all-or-nothing, and a
      // single 404 (an icon not regenerated, say) would leave the site with no
      // offline copy at all rather than a partial one.
      await Promise.all(
        SHELL.map(async (path) => {
          try {
            const request = new Request(path, { cache: "reload" });
            const response = await fetch(request);
            if (response && response.ok) await cache.put(path, response);
          } catch {
            // Offline at install time, or a missing file. Runtime will fill in.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("vg-") &&
              key !== SHELL_CACHE &&
              key !== RUNTIME_CACHE,
          )
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// --- Fetch strategies -------------------------------------------------------

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigate(request));
    return;
  }
  if (isRuntimeAsset(url)) {
    event.respondWith(handleRuntime(event, request, url));
    return;
  }
  if (SHELL_URLS.has(url.href)) {
    event.respondWith(handleShell(request));
  }
});

/**
 * Navigations: network first, so a deploy is picked up the moment the phone
 * has signal, falling back to the cached shell. The site is a hash-routed
 * single page, so every route's fallback is the same index.html.
 */
async function handleNavigate(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put("./index.html", response.clone()).catch(() => undefined);
    }
    return response;
  } catch {
    const cached =
      (await caches.match("./index.html")) ?? (await caches.match("./"));
    if (cached) return cached;
    return new Response("Offline, and no cached copy of the site yet.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/** Shell assets: cache first (they are versioned by the cache name). */
async function handleShell(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone()).catch(() => undefined);
  }
  return response;
}

/**
 * Media: cache first, revalidated in the background.
 *
 * The Range branch is the important one. `<audio>` on iOS asks for byte ranges
 * and refuses a plain 200 in reply, so a naive cache-first service worker
 * silences the narration it was supposed to be speeding up. Cached bodies are
 * sliced into a real 206 instead; a range miss goes to the network untouched
 * and warms the cache with one full fetch alongside.
 */
const warming = new Set();

async function handleRuntime(event, request, url) {
  const cache = await caches.open(RUNTIME_CACHE);
  // Key on the bare URL: the Range header must not become part of the key, and
  // the same clip is requested with and without one.
  const key = url.href;

  if (request.headers.has("range")) {
    const cached = await cache.match(key);
    if (cached) {
      const partial = await sliceResponse(cached, request.headers.get("range"));
      if (partial) return partial;
    }
    event.waitUntil(warmUp(cache, key));
    return fetch(request);
  }

  const cached = await cache.match(key);
  if (cached) {
    // Cache.keys() is insertion-ordered, and a successful revalidate re-inserts
    // — so entries that are actually being played drift to the back of the
    // queue and the eviction below takes the coldest ones. Offline use never
    // reorders anything, which is harmless: offline use also never adds.
    event.waitUntil(refresh(cache, key));
    return cached;
  }

  const response = await fetch(request);
  if (response && response.ok && response.status === 200) {
    event.waitUntil(store(cache, key, response.clone()));
  }
  return response;
}

async function warmUp(cache, key) {
  if (warming.has(key)) return;
  warming.add(key);
  try {
    const existing = await cache.match(key);
    if (!existing) await refresh(cache, key);
  } finally {
    warming.delete(key);
  }
}

async function refresh(cache, key) {
  try {
    // no-cache, not reload: GitHub Pages answers with an ETag, so an unchanged
    // clip revalidates for a few hundred bytes instead of re-downloading.
    const response = await fetch(key, { cache: "no-cache" });
    if (response && response.ok && response.status === 200) {
      await store(cache, key, response);
    }
  } catch {
    // Offline. The cached copy stands.
  }
}

async function store(cache, key, response) {
  try {
    await cache.put(key, response);
    await trimCache(cache, RUNTIME_MAX_ENTRIES);
  } catch {
    // Quota, or a response that cannot be cached. Not worth failing over.
  }
}

async function trimCache(cache, max) {
  const keys = await cache.keys();
  const excess = keys.length - max;
  if (excess <= 0) return;
  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}

/** Turn a cached 200 into the 206 a media element asked for. */
async function sliceResponse(response, rangeHeader) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(rangeHeader).trim());
  if (!match) return null;

  let buffer;
  try {
    buffer = await response.clone().arrayBuffer();
  } catch {
    return null;
  }
  const size = buffer.byteLength;

  let start;
  let end;
  if (match[1] === "") {
    const suffix = Number(match[2]);
    if (!suffix) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || end < start || end >= size) return null;

  const body = buffer.slice(start, end + 1);
  return new Response(body, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Length": String(body.byteLength),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
    },
  });
}
