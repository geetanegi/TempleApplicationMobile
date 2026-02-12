import { getAuth } from './getApi';
import { postAuth } from './postApi';
import { API } from '../endpoints';

/**
 * Fetch all active temples with coordinates for TempleLocator map.
 * @returns {Promise<Array<{ id, name, location, type, latitude, longitude, address?, image? }>>}
 */
export const getTempleList = async () => {
  const res = await getAuth(API.TEMPLE_LIST());
  const raw = res?.data ?? res;
  const list = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw ?? []);
  return Array.isArray(list) ? list : [];
};

/**
 * Record a temple view (fire-and-forget, optimized for viral traffic).
 * Call when user views the temple details page. Does not block.
 */
export const recordTempleView = (templeId) => {
  if (!templeId) return;
  postAuth(API.TEMPLE_VIEW(templeId), {}).catch(() => {});
};

/**
 * Fetch popular temples (most views)
 */
export const getPopularTemples = async () => {
  const res = await getAuth(API.TEMPLE_POPULAR());
  const raw = res?.data ?? res;
  const list = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw ?? []);
  return Array.isArray(list) ? list : [];
};

/**
 * Fetch trending temples (most views, smaller set)
 */
export const getTrendingTemples = async () => {
  const res = await getAuth(API.TEMPLE_TRENDING());
  const raw = res?.data ?? res;
  const list = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw ?? []);
  return Array.isArray(list) ? list : [];
};

/**
 * Temple user locates their temple on map. Creates or updates temple with coordinates.
 * @param {number} userId
 * @param {{ latitude: number, longitude: number, templeName?: string, location?: string }} params
 */
export const locateTemple = async (userId, { latitude, longitude, templeName, location }) => {
  const body = { userId, latitude, longitude };
  if (templeName != null) body.templeName = templeName;
  if (location != null) body.location = location;
  const res = await postAuth(API.TEMPLE_LOCATE(), body);
  return res?.data ?? res;
};
