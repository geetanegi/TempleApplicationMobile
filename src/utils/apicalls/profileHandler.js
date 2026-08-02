import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {environment} from '../constant';
import {API} from '../endpoints';
import {getApiHeader} from './apiHandler';
import {getAuth} from './getApi';
import {postAuth} from './postApi';
import {getFollowersCount, getFollowingCount} from './socialHandler';
import {retrieveData} from './index';
import {storeTokenData} from './tokenApi';

const PROFILE_PIC_UPDATED_PREFIX = 'profilePicUpdatedAt_';

/** Store timestamp when profile picture is updated (for cache busting across screens). */
export const setProfilePictureUpdatedAt = async (userId) => {
  try {
    if (userId != null) {
      await AsyncStorage.setItem(PROFILE_PIC_UPDATED_PREFIX + userId, String(Date.now()));
    }
  } catch (_) {}
};

/** Get stored timestamp for profile picture cache busting. */
export const getProfilePictureUpdatedAt = async (userId) => {
  try {
    if (userId == null) return null;
    const v = await AsyncStorage.getItem(PROFILE_PIC_UPDATED_PREFIX + userId);
    return v ? Number(v) : null;
  } catch (_) {
    return null;
  }
};

/**
 * Server base URL (no /api, no trailing slash) for proxy endpoints like profile picture.
 * The trailing slash must be stripped: baseUrl ends with '/' (e.g. '.../jain-app/') and the
 * proxy paths start with '/', so joining them raw yields '/jain-app//user/...' which Tomcat
 * rejects with 403 - that is why avatars never rendered.
 */
const serverBase = () => (environment.baseUrl || '').replace(/\/api\/?$/, '').replace(/\/+$/, '');

/**
 * Full URL for profile picture. Handles both proxy path (/user/social/profile/ID/picture) and legacy full URLs.
 */
export const getProfilePictureUrl = (profile) => {
  const url = profile?.userProfile?.imageUrl ?? profile?.avatar ?? null;
  return resolveProfilePictureUrl(url);
};

/** Turn a profile image URL or path into a full URL (for proxy paths). Accepts string or object with imageUrl/avatar. */
export const resolveProfilePictureUrl = (url) => {
  if (url == null) return null;
  const str = typeof url === 'string' ? url : (url?.imageUrl ?? url?.avatar ?? null);
  if (!str || typeof str !== 'string') return null;
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('file://')) return str;
  const base = serverBase();
  return base ? `${base}/${str.replace(/^\/+/, '')}` : str;
};

/** Profile picture URL by user id (proxy path). Use when API does not return imageUrl (e.g. post/comment user). */
export const getProfilePictureUrlByUserId = (userId) => {
  if (userId == null) return null;
  return resolveProfilePictureUrl(`/user/social/profile/${userId}/picture`);
};

/**
 * Profile APIs integrated for the profile screen (use social auth, same as feeds/follow):
 * - getUserProfileById(userId)  → GET user/social/profile/{userId}
 * - getProfileWithCounts(userId) → profile + getFollowersCount + getFollowingCount (social)
 * - updateProfile(userId, body) → PUT user/social/profile/update
 * - updateProfilePicture(userId, fileUri) → POST user/social/profile/picture
 *
 * Backend/DB: Username = user_master.username, Description = user_profile.description
 */
export const getUserProfileById = async (userId) => {
  try {
    if (userId == null) return undefined;
    const url = API.SOCIAL_PROFILE(userId);
    const result = await getAuth(url);
    const raw = result?.data ?? result;
    if (raw && typeof raw === 'object' && (raw.username != null || raw.userProfile != null)) {
      return raw;
    }
    if (result && typeof result === 'object') return result;
    return undefined;
  } catch (err) {
    console.log('getUserProfileById error', err);
    return undefined;
  }
};

/**
 * Fetch profile plus follower/following counts for profile screen.
 */
export const getProfileWithCounts = async (userId) => {
  try {
    const parseCount = (val) => {
      // Accept: number | numeric string | { data: number } | { count: number } | { data: { count } } etc.
      if (val == null) return 0;
      if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
      if (typeof val === 'string') {
        const n = Number(val);
        return Number.isFinite(n) ? n : 0;
      }
      if (typeof val === 'object') {
        const v =
          val?.data?.data ?? // axios-ish: { data: { data: X } }
          val?.data ??      // axios-ish: { data: X }
          val?.count ??
          val?.total ??
          val?.totalElements ??
          val?.value ??
          val?.result ??
          val?.data?.count ??
          val?.data?.total ??
          val?.data?.totalElements ??
          val?.data?.value ??
          val?.data?.result;
        return parseCount(v);
      }
      return 0;
    };

    const [profileRes, followersRes, followingRes] = await Promise.all([
      getUserProfileById(userId),
      getFollowersCount(userId).catch(() => 0),
      getFollowingCount(userId).catch(() => 0),
    ]);
    const profile = profileRes && typeof profileRes === 'object' ? profileRes : undefined;
    const followersCount = parseCount(followersRes);
    const followingCount = parseCount(followingRes);
    return { profile, followersCount, followingCount };
  } catch (err) {
    console.log('getProfileWithCounts error', err);
    return { profile: undefined, followersCount: 0, followingCount: 0 };
  }
};

/**
 * Check if a username is available (excluding the current user).
 * @returns {{ available: boolean, message: string }}
 */
export const checkUsernameAvailability = async (username, userId) => {
  const url = API.SOCIAL_CHECK_USERNAME(username, userId);
  const config = await getApiHeader(true);
  const res = await axios.get(url, config);
  return res?.data?.data ?? res?.data;
};

/**
 * Update profile fields (social backend).
 * @param {number|string} userId
 * @param {{ firstName?: string, lastName?: string, description?: string, location?: string, contactNumber?: string, alternateEmail?: string }} body
 */
export const updateProfile = async (userId, body) => {
  const params = new URLSearchParams();
  params.append('userId', String(userId));
  if (body.username != null) params.append('username', body.username);
  if (body.firstName != null) params.append('firstName', body.firstName);
  if (body.lastName != null) params.append('lastName', body.lastName);
  if (body.description != null) params.append('description', body.description);
  if (body.location != null) params.append('location', body.location);
  if (body.city != null) params.append('city', body.city);
  if (body.contactNumber != null) params.append('contactNumber', body.contactNumber);
  if (body.alternateEmail != null) params.append('alternateEmail', body.alternateEmail);
  const url = `${API.SOCIAL_PROFILE_UPDATE}?${params.toString()}`;
  const config = await getApiHeader(true);
  const res = await axios.put(url, null, config);
  const raw = res?.data?.data ?? res?.data;
  if (raw?.token) {
    await storeTokenData(raw.token);
  }
  return raw?.profile ?? raw;
};

/** Normalize file URI for FormData - Android may need file:// prefix for absolute paths */
function normalizeProfilePictureUri(uri) {
  if (!uri || typeof uri !== 'string') return uri;
  const t = uri.trim();
  if (t.startsWith('content://') || t.startsWith('file://')) return t;
  if (t.startsWith('/')) return 'file://' + t;
  return t;
}

/**
 * Update profile picture (social backend). Uses fetch instead of axios - React Native
 * fetch handles FormData correctly and sets Content-Type with boundary.
 */
export const updateProfilePicture = async (userId, fileUri, options = {}) => {
  const normalizedUri = normalizeProfilePictureUri(fileUri);
  const mime = options.mime || 'image/jpeg';
  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
  const formData = new FormData();
  formData.append('userId', String(userId));
  formData.append('file', {
    uri: normalizedUri,
    type: mime,
    name: `profile.${ext}`,
  });

  const token = await retrieveData();
  const url = API.SOCIAL_PROFILE_PICTURE;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      // Do NOT set Content-Type - fetch sets multipart/form-data with boundary for FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData?.message || errData?.data?.message || res.statusText || 'Upload failed';
    const err = new Error(msg);
    err.response = { status: res.status, data: errData };
    throw err;
  }
  const json = await res.json();
  await setProfilePictureUpdatedAt(userId);
  return { data: json };
};

/**
 * Search users by username or name (whole user master: normal + temple users).
 * @param {string} query - Search string for username, firstName, or lastName
 * @param {number} [page=0]
 * @param {number} [size=30]
 * @returns {Promise<Array<{ id, username, firstName, lastName, email?, imageUrl?, location? }>>}
 */
export const searchUsers = async (query, page = 0, size = 30) => {
  const trimmed = (query || '').trim();
  if (!trimmed) return [];
  try {
    const params = {
      searchParams: {
        username: trimmed,
        firstName: trimmed,
        lastName: trimmed,
        email: trimmed,
      },
      pageSortingParam: {
        pageNumber: page,
        pageSize: size,
      },
    };
    const res = await postAuth(API.USER_SEARCH(), params);
    const raw = res?.data ?? res;
    if (typeof raw === 'string') return [];
    const content = raw?.content ?? raw?.data ?? (Array.isArray(raw) ? raw : []);
    const list = Array.isArray(content) ? content : [];
    return list.map((u) => ({
      id: u.id,
      username: u.username ?? '',
      firstName: u.firstName ?? '',
      lastName: u.lastName ?? '',
      email: u.email,
      imageUrl: u.imageUrl ?? u.imageBase64,
      location: u.location,
    }));
  } catch (err) {
    console.log('searchUsers error', err);
    return [];
  }
};