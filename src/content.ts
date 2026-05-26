const SUPPORTED_HOSTNAMES = new Set(["x.com", "twitter.com"]);
const HOME_PATHNAME = "/home";
const HOME_TIMELINE_SELECTOR =
  '[data-testid="primaryColumn"] [aria-label="Timeline: Your Home Timeline"]';
const HIDDEN_ATTR = "data-xterminator-hidden";

const hiddenElements = new WeakSet<HTMLElement>();
let lastHref = window.location.href;

function isSupportedHomeRoute(): boolean {
  return (
    SUPPORTED_HOSTNAMES.has(window.location.hostname) &&
    window.location.pathname === HOME_PATHNAME
  );
}

function setImportantDisplayNone(element: HTMLElement): void {
  element.style.setProperty("display", "none", "important");
  element.setAttribute(HIDDEN_ATTR, "true");
  hiddenElements.add(element);
}

function clearHiddenTimelines(): void {
  document.querySelectorAll<HTMLElement>(`[${HIDDEN_ATTR}]`).forEach((element) => {
    element.style.removeProperty("display");
    element.removeAttribute(HIDDEN_ATTR);
  });
}

function hideHomeTimeline(): void {
  if (!isSupportedHomeRoute()) {
    clearHiddenTimelines();
    return;
  }

  document
    .querySelectorAll<HTMLElement>(HOME_TIMELINE_SELECTOR)
    .forEach((element) => {
      if (!hiddenElements.has(element) || element.style.display !== "none") {
        setImportantDisplayNone(element);
      }
    });
}

function handlePossibleRouteChange(): void {
  if (window.location.href === lastHref) {
    hideHomeTimeline();
    return;
  }

  lastHref = window.location.href;
  hideHomeTimeline();
}

function wrapHistoryMethod(methodName: "pushState" | "replaceState"): void {
  const original = window.history[methodName];

  window.history[methodName] = function wrappedHistoryMethod(
    ...args: Parameters<History[typeof methodName]>
  ): ReturnType<History[typeof methodName]> {
    const result = original.apply(this, args);
    queueMicrotask(handlePossibleRouteChange);
    return result;
  };
}

function start(): void {
  wrapHistoryMethod("pushState");
  wrapHistoryMethod("replaceState");

  window.addEventListener("popstate", handlePossibleRouteChange);

  const observer = new MutationObserver(handlePossibleRouteChange);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  hideHomeTimeline();
}

start();
