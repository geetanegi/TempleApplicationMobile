/**
 * Open another user's profile on the current stack.
 * Uses push so nested flows (search → profile → following → profile) back correctly.
 * Walks up parent navigators when Profiles isn't on the active stack (e.g. Reels tab).
 */
export function openUserProfile(navigation, userId, extraParams = {}) {
  if (!userId || !navigation) return;

  let nav = navigation;
  while (nav) {
    const routeNames = nav.getState?.()?.routeNames;
    if (Array.isArray(routeNames) && routeNames.includes('Profiles') && nav.push) {
      nav.push('Profiles', { userId, ...extraParams });
      return;
    }
    nav = nav.getParent?.();
  }

  navigation.navigate?.('Profiles', { userId, ...extraParams });
}

/**
 * Open post preview on the current stack so back returns to the previous screen
 * (e.g. profile grid), not the home dashboard.
 */
export function openPostPreview(navigation, postId) {
  if (!postId || !navigation) return;

  let nav = navigation;
  while (nav) {
    const routeNames = nav.getState?.()?.routeNames;
    if (Array.isArray(routeNames) && routeNames.includes('PostPreview') && nav.push) {
      nav.push('PostPreview', { postId });
      return;
    }
    nav = nav.getParent?.();
  }

  navigation.navigate?.('Home', { screen: 'PostPreview', params: { postId } });
}

/**
 * Safe back: pops stack when possible, otherwise returns to a sensible home screen.
 */
export function safeGoBack(navigation, { fallbackRoute = 'MainDashboard' } = {}) {
  if (!navigation) return;
  if (navigation.canGoBack?.()) {
    navigation.goBack();
    return;
  }
  navigation.navigate(fallbackRoute);
}
