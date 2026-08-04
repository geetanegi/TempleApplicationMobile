import { Image } from 'react-native';

/** Assumed aspect (width / height) while the intrinsic size is still unknown. */
const FALLBACK_ASPECT = 4 / 5;
/**
 * Instagram-style bounds for feed media (width / height).
 * Tall portraits are capped at 4:5 so posts do not dominate the screen;
 * wide landscapes are floored at ~1.91:1.
 */
const MIN_ASPECT = 4 / 5;
const MAX_ASPECT = 1.91;
/**
 * Hard ceiling vs screen height so captions/actions stay reachable even when
 * window size reports oddly on some OEMs (Realme/OPPO).
 */
const MAX_SCREEN_HEIGHT_RATIO = 0.65;

const sizeCache = new Map();

export function getCachedImageSize(uri) {
  if (!uri) return null;
  return sizeCache.get(uri) || null;
}

export function setCachedImageSize(uri, width, height) {
  if (!uri || !width || !height) return;
  // Ignore nonsensical sizes (can appear on some Android OEM decoders).
  if (width < 1 || height < 1 || width > 20000 || height > 20000) return;
  sizeCache.set(uri, { width, height });
}

/**
 * Feed media height for a given screen width and intrinsic image size.
 *
 * Clamps aspect into an Instagram-like window so profile/feed posts stay a
 * stable, readable size. Pair with a fixed-height clip container + absolute
 * Image (see PostCard) — required on Realme/ColorOS where Image can otherwise
 * ignore style height and expand the layout.
 *
 * @param {number} screenW - available width in px
 * @param {number} imgW - intrinsic image width
 * @param {number} imgH - intrinsic image height
 * @param {number} [screenH] - screen height, used as a hard cap
 */
export function getClampedFeedMediaHeight(screenW, imgW, imgH, screenH) {
  if (!screenW || screenW < 1) return 340;
  if (!imgW || !imgH || imgW < 1 || imgH < 1) {
    return Math.round(screenW / FALLBACK_ASPECT);
  }

  let aspect = imgW / imgH;
  if (!Number.isFinite(aspect) || aspect <= 0) {
    return Math.round(screenW / FALLBACK_ASPECT);
  }
  aspect = Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, aspect));

  let height = Math.round(screenW / aspect);
  if (screenH && screenH > 0) {
    height = Math.min(height, Math.round(screenH * MAX_SCREEN_HEIGHT_RATIO));
  }
  // Never taller than ~1.25× width (4:5) as a final safety net.
  height = Math.min(height, Math.round(screenW / MIN_ASPECT));
  return Math.max(120, height);
}

export function prefetchImageSize(uri) {
  if (!uri) return Promise.resolve(null);
  const cached = sizeCache.get(uri);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    Image.getSize(
      uri,
      (width, height) => {
        if (!width || !height || width < 1 || height < 1) {
          resolve(null);
          return;
        }
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
