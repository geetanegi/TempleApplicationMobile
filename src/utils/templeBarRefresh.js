/**
 * Callback to refresh the "Locate your temple" bar visibility.
 * Called after user saves temple location so the bar disappears immediately.
 */
let onRefresh = null;

export const setTempleBarRefreshCallback = (cb) => {
  onRefresh = cb;
};

export const triggerTempleBarRefresh = () => {
  onRefresh?.();
};
