import { API } from '../endpoints';
import { getAuth, getAuthWithParams } from './getApi';
import { postAuth } from './postApi';

/**
 * Build URL with query string from params object.
 * Used for social APIs that expect @RequestParam (e.g. follow, like, comment).
 */
const urlWithParams = (baseUrl, params) => {
  const search = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return search ? `${baseUrl}?${search}` : baseUrl;
};

// ----------- Follow / Unfollow -----------

export const follow = async (followerId, followingId) => {
  const url = urlWithParams(API.SOCIAL_FOLLOW(), { followerId, followingId });
  return postAuth(url, {});
};

export const unfollow = async (followerId, followingId) => {
  const url = urlWithParams(API.SOCIAL_UNFOLLOW(), { followerId, followingId });
  return postAuth(url, {});
};

export const getFollowers = async (userId) => {
  const url = API.SOCIAL_FOLLOWERS(userId);
  return getAuth(url);
};

export const getFollowing = async (userId) => {
  const url = API.SOCIAL_FOLLOWING(userId);
  return getAuth(url);
};

export const getFollowersCount = async (userId) => {
  const url = API.SOCIAL_FOLLOWERS_COUNT(userId);
  return getAuth(url);
};

export const getFollowingCount = async (userId) => {
  const url = API.SOCIAL_FOLLOWING_COUNT(userId);
  return getAuth(url);
};

export const isFollowing = async (followerId, followingId) => {
  const url = API.SOCIAL_IS_FOLLOWING();
  return getAuthWithParams(url, { followerId, followingId });
};

// ----------- Posts (return likesCount, commentsCount, sharesCount, isLiked, isShared when currentUserId passed) -----------

export const getAllPosts = async (currentUserId = null) => {
  const base = API.SOCIAL_POSTS;
  const url = currentUserId != null ? urlWithParams(base, { currentUserId }) : base;
  return getAuth(url);
};

export const getUserPosts = async (userId, currentUserId = null) => {
  const url = urlWithParams(API.SOCIAL_POSTS_BY_USER(userId), { currentUserId });
  return getAuth(url);
};

export const getPostById = async (postId, currentUserId = null) => {
  const url = urlWithParams(API.SOCIAL_POST_BY_ID(postId), { currentUserId });
  return getAuth(url);
};

export const getPostsByTemple = async (templeId, page = 0, size = 10, currentUserId = null) => {
  const url = urlWithParams(`${API.SOCIAL_POSTS_BY_TEMPLE(templeId)}?page=${page}&size=${size}`, { currentUserId });
  return getAuth(url);
};

// ----------- Likes -----------

export const likePost = async (postId, userId) => {
  const url = urlWithParams(API.SOCIAL_LIKE(), { postId, userId });
  return postAuth(url, {});
};

export const unlikePost = async (postId, userId) => {
  const url = urlWithParams(API.SOCIAL_UNLIKE(), { postId, userId });
  return postAuth(url, {});
};

export const getLikesCount = async (postId) => {
  const url = API.SOCIAL_POST_LIKES_COUNT(postId);
  return getAuth(url);
};

export const getLikedUsers = async (postId) => {
  const url = API.SOCIAL_POST_LIKES_USERS(postId);
  return getAuth(url);
};

export const hasUserLiked = async (postId, userId) => {
  const url = API.SOCIAL_POST_IS_LIKED(postId);
  return getAuthWithParams(url, { userId });
};

// ----------- Comments -----------

export const commentOnPost = async (postId, userId, content) => {
  const url = urlWithParams(API.SOCIAL_POST_COMMENT(postId), { userId, content });
  return postAuth(url, {});
};

export const getComments = async (postId) => {
  const url = API.SOCIAL_POST_COMMENTS(postId);
  return getAuth(url);
};

export const getCommentsCount = async (postId) => {
  const url = API.SOCIAL_POST_COMMENTS_COUNT(postId);
  return getAuth(url);
};

export const getCommentsByUser = async (userId) => {
  const url = API.SOCIAL_COMMENTS_BY_USER(userId);
  return getAuth(url);
};

// ----------- Shares -----------

export const sharePost = async (postId, userId) => {
  const url = urlWithParams(API.SOCIAL_SHARE(), { postId, userId });
  return postAuth(url, {});
};

export const unsharePost = async (postId, userId) => {
  const url = urlWithParams(API.SOCIAL_UNSHARE(), { postId, userId });
  return postAuth(url, {});
};

export const getSharesCount = async (postId) => {
  const url = API.SOCIAL_POST_SHARES_COUNT(postId);
  return getAuth(url);
};

export const hasUserShared = async (postId, userId) => {
  const url = API.SOCIAL_POST_IS_SHARED(postId);
  return getAuthWithParams(url, { userId });
};
