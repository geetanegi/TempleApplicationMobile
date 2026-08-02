import { Image } from 'react-native';

/** Assumed aspect (width / height) while the intrinsic size is still unknown. */
const FALLBACK_ASPECT = 4 / 5;
/**
 * Media is never taller than this share of the screen, so the caption and action row
 * stay reachable even for an extremely tall upload. Anything past the cap is letterboxed
 * by resizeMode="contain", never cropped.
 */
const MAX_SCREEN_HEIGHT_RATIO = 0.8;
/** Cap used when the screen height is not known: 1.6x the width (taller than 4:5 or 9:16 crops). */
const MAX_WIDTH_HEIGHT_RATIO = 1.6;

const sizeCache = new Map();

export function getCachedImageSize(uri) {
  if (!uri) return null;
  return sizeCache.get(uri) || null;
}

export function setCachedImageSize(uri, width, height) {
  if (!uri || !width || !height) return;
  sizeCache.set(uri, { width, height });
}

/**
 * Feed media height for a given screen width and intrinsic image size.
 *
 * Sizes the box to the image's own aspect ratio so the photo is shown exactly as it was
 * uploaded. Previously this clamped the aspect to an Instagram-like 4:5..1.91:1 window,
 * which combined with resizeMode="cover" silently cut the top/bottom off tall portraits
 * and the sides off panoramas.
 *
 * @param {number} screenW - available width in px
 * @param {number} imgW - intrinsic image width
 * @param {number} imgH - intrinsic image height
 * @param {number} [screenH] - screen height, used to cap runaway-tall media
 */
export function getClampedFeedMediaHeight(screenW, imgW, imgH, screenH) {
  if (!screenW) return 340;
  if (!imgW || !imgH) return Math.round(screenW / FALLBACK_ASPECT);

  const naturalHeight = screenW * (imgH / imgW);
  const maxHeight = screenH
    ? screenH * MAX_SCREEN_HEIGHT_RATIO
    : screenW * MAX_WIDTH_HEIGHT_RATIO;
  return Math.round(Math.min(naturalHeight, maxHeight));
}

export function prefetchImageSize(uri) {
  if (!uri) return Promise.resolve(null);
  const cached = sizeCache.get(uri);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    Image.getSize(
      uri,
      (width, height) => {
        const size = { width, height };
        sizeCache.set(uri, size);
        resolve(size);
      },
      () => resolve(null),
    );
  });
}

export function prefetchImageSizes(uris = []) {
  const unique = [...new Set(uris.filter(Boolean))];
  return Promise.all(unique.map(prefetchImageSize));
}
