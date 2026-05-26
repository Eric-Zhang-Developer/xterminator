import "./popup.css";

const ENABLED_STORAGE_KEY = "xterminatorEnabled";
const DEFAULT_ENABLED = true;

const toggle = document.querySelector<HTMLInputElement>("#enabled-toggle");
const statusText = document.querySelector<HTMLElement>("#status-text");

function getEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { [ENABLED_STORAGE_KEY]: DEFAULT_ENABLED },
      (items: { [ENABLED_STORAGE_KEY]?: boolean }) => {
        resolve(items[ENABLED_STORAGE_KEY] ?? DEFAULT_ENABLED);
      }
    );
  });
}

function setEnabled(enabled: boolean): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [ENABLED_STORAGE_KEY]: enabled }, resolve);
  });
}

function render(enabled: boolean): void {
  if (toggle) {
    toggle.checked = enabled;
  }

  if (statusText) {
    statusText.textContent = enabled ? "Home feed blocked" : "Home feed visible";
  }
}

async function init(): Promise<void> {
  if (!toggle) {
    return;
  }

  render(await getEnabled());

  toggle.addEventListener("change", async () => {
    const nextEnabled = toggle.checked;
    render(nextEnabled);
    await setEnabled(nextEnabled);
  });
}

init();
