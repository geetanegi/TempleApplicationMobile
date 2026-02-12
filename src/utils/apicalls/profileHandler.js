import axios from 'axios';
import {environment} from '../constant';
import {API} from '../endpoints';
import {getApiHeader} from './apiHandler';
import {getAuth} from './getApi';
import {postAuth} from './postApi';
import {getFollowersCount, getFollowingCount} from './socialHandler';
import {uploadApi} from './index';

/** Server base URL (no /api) for proxy endpoints like profile picture */
const serverBase = () => (environment.baseUrl || '').replace(/\/api\/?$/, '');

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
  return base ? `${base}${str.startsWith('/') ? str : '/' + str}` : str;
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
    const [profileRes, followersRes, followingRes] = await Promise.all([
      getUserProfileById(userId),
      getFollowersCount(userId).then(r => r?.data ?? r).catch(() => 0),
      getFollowingCount(userId).then(r => r?.data ?? r).catch(() => 0),
    ]);
    const profile = profileRes && typeof profileRes === 'object' ? profileRes : undefined;
    const followersCount = typeof followersRes === 'number' ? followersRes : Number(followersRes) || 0;
    const followingCount = typeof followingRes === 'number' ? followingRes : Number(followingRes) || 0;
    return { profile, followersCount, followingCount };
  } catch (err) {
    console.log('getProfileWithCounts error', err);
    return { profile: undefined, followersCount: 0, followingCount: 0 };
  }
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
  return res?.data?.data ?? res?.data;
};

/**
 * Update profile picture (social backend). fileUri = local image path from picker.
 */
export const updateProfilePicture = async (userId, fileUri) => {
  const formData = new FormData();
  formData.append('userId', String(userId));
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });
  return uploadApi(API.SOCIAL_PROFILE_PICTURE, formData);
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