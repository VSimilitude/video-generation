// The family hub (kthanks.com) is the primary way into the videos. It
// deep-links straight to a video (`?hub=<origin>#/<CompositionId>`) and the
// back buttons here return to it — never to this site's own gallery, which
// now lives at #/all as a review tool rather than a front door.

const HUB_DEFAULT = "https://kthanks.com/";

const hubParam = new URLSearchParams(window.location.search).get("hub");

/** Where "home" is: the hub's own origin when it told us, else the live hub. */
export function hubHome(): string {
  return hubParam && /^https?:\/\//.test(hubParam) ? hubParam : HUB_DEFAULT;
}

/** Back to the hub: via history when the hub is the previous page, else by URL. */
export function returnToHub(): void {
  const home = hubHome();
  if (hubParam !== null && window.history.length > 1 && document.referrer.startsWith(home)) {
    window.history.back();
  } else {
    window.location.href = home;
  }
}
