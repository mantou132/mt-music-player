export function isSupportPaintWorklet() {
  return 'paintWorklet' in CSS;
}

export function isSupportWerviceWorker() {
  return 'serviceWorker' in navigator;
}
