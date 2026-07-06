import { Image } from 'react-native';

/** Instagram-style feed limits: tallest 4:5, widest ~1.91:1 */
const MIN_ASPECT = 1.91; // width / height (landscape)
const MAX_ASPECT = 4 / 5; // width / height (portrait)

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
 * Clamps to Instagram-like min/max aspect ratios.
 */
export function getClampedFeedMediaHeight(screenW, imgW, imgH) {
  if (!screenW) return 340;
  if (!imgW || !imgH) return Math.round(screenW / MAX_ASPECT);

  const aspect = imgW / imgH;
  const clampedAspect = Math.min(MIN_ASPECT, Math.max(MAX_ASPECT, aspect));
  return Math.round(screenW / clampedAspect);
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
