import { getReelsFeed } from './apicalls/reelHandler';
import { getUserId } from '../redux/store/getState';

const PREFETCH_SIZE = 5;

let cachedFeed = null;
let prefetchPromise = null;
let prefetchTimestamp = 0;

const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes (presigned URLs last 120 min, so this is safe)

export const prefetchReels = () => {
  if (prefetchPromise) return prefetchPromise;

  const currentUserId = getUserId();
  prefetchPromise = getReelsFeed(0, PREFETCH_SIZE, currentUserId)
    .then((res) => {
      const feed = res?.data;
      if (feed && Array.isArray(feed.reels) && feed.reels.length > 0) {
        cachedFeed = feed;
        prefetchTimestamp = Date.now();
      }
      prefetchPromise = null;
      return feed;
    })
    .catch((err) => {
      console.warn('Reels prefetch failed (non-blocking):', err?.message);
      prefetchPromise = null;
      return null;
    });

  return prefetchPromise;
};

export const consumePrefetchedReels = () => {
  if (!cachedFeed) return null;
  if (Date.now() - prefetchTimestamp > MAX_CACHE_AGE_MS) {
    cachedFeed = null;
    return null;
  }
  const feed = cachedFeed;
  cachedFeed = null;
  return feed;
};

export const hasPrefetchedReels = () => {
  if (!cachedFeed) return false;
  if (Date.now() - prefetchTimestamp > MAX_CACHE_AGE_MS) {
    cachedFeed = null;
    return false;
  }
  return true;
};

export const invalidatePrefetchCache = () => {
  cachedFeed = null;
  prefetchPromise = null;
};
