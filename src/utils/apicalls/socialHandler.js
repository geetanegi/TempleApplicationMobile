import { API } from '../endpoints';
import { getAuth, getAuthWithParams } from './getApi';
import { postAuth } from './postApi';
import { putAuth } from './putApi';
import { deleteAuthWithParams } from './deleteApi';
import { retrieveData, uploadApi } from './index';

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

/** Normalize file URI for FormData - Android may need file:// prefix */
function normalizeFileUri(uri) {
  if (!uri || typeof uri !== 'string') return uri;
  const t = uri.trim();
  if (t.startsWith('content://') || t.startsWith('file://')) return t;
  if (t.startsWith('/')) return 'file://' + t;
  return t;
}

/**
 * Create a post with photo or video. Uses fetch for FormData - axios can fail on RN.
 * @param {number|string} userId
 * @param {string} text - Caption/content text
 * @param {string} fileUri - Local file URI (image or video)
 * @param {'photo'|'video'} mediaType - Whether the file is a photo or video
 * @param {{ thumbnailUri?: string, onUploadProgress?: (percent: number) => void }} options - Optional; thumbnailUri for video; onUploadProgress (XHR only, not used with fetch)
 */
export const createPost = async (userId, text, fileUri, mediaType, options = {}) => {
  const normalizedUri = normalizeFileUri(fileUri);
  const formData = new FormData();
  formData.append('userId', String(userId));
  if (text != null && text.trim() !== '') formData.append('text', text.trim());
  const isVideo = mediaType === 'video';
  const filename = (fileUri || '').split('/').pop() || (isVideo ? 'video.mp4' : 'photo.jpg');
  formData.append(isVideo ? 'video' : 'photo', {
    uri: normalizedUri,
    type: isVideo ? 'video/mp4' : 'image/jpeg',
    name: filename,
  });
  if (isVideo && options.thumbnailUri && typeof options.thumbnailUri === 'string' && options.thumbnailUri.trim()) {
    formData.append('thumbnail', {
      uri: normalizeFileUri(options.thumbnailUri.trim()),
      type: 'image/jpeg',
      name: 'thumbnail.jpg',
    });
  }

  const token = await retrieveData();
  const res = await fetch(API.SOCIAL_POST_CREATE, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData?.message || errData?.data?.message || res.statusText || 'Failed to create post';
    const err = new Error(msg);
    err.response = { status: res.status, data: errData };
    err.data = errData;
    throw err;
  }
  const json = await res.json();
  return { data: json?.data ?? json };
};

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

export const deletePost = async (postId, userId) => {
  const url = API.SOCIAL_POST_DELETE(postId);
  return deleteAuthWithParams(url, { userId });
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

/** Reply to a comment. Same endpoint as comment with parentCommentId. */
export const replyToComment = async (postId, userId, parentCommentId, content) => {
  const url = urlWithParams(API.SOCIAL_POST_COMMENT(postId), {
    userId,
    content,
    parentCommentId,
  });
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

export const deleteComment = async (postId, commentId, userId) => {
  const url = API.SOCIAL_DELETE_COMMENT(postId, commentId);
  return deleteAuthWithParams(url, { userId });
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

// ----------- Stories -----------

export const getStoriesFeed = async (currentUserId) => {
  const url = urlWithParams(API.SOCIAL_STORY_FEED, { currentUserId });
  return getAuth(url);
};

export const getStoriesByUser = async (userId, currentUserId = null) => {
  const url = urlWithParams(API.SOCIAL_STORY_BY_USER(userId), { currentUserId });
  return getAuth(url);
};

export const addStoryView = async (storyId, viewerId) => {
  const url = urlWithParams(API.SOCIAL_STORY_ADD_VIEW(storyId), { viewerId });
  return postAuth(url, {});
};

export const deleteStory = async (storyId, userId) => {
  const url = urlWithParams(API.SOCIAL_STORY_DELETE(storyId), { userId });
  return deleteAuthWithParams(url, { userId });
};

export const createStory = async (userId, mediaType, fileUri) => {
  const normalizedUri = normalizeFileUri(fileUri);
  const isVideo = mediaType.toUpperCase() === 'VIDEO';
  const formData = new FormData();
  formData.append('userId', String(userId));
  formData.append('mediaType', mediaType.toUpperCase());
  formData.append('file', {
    uri: normalizedUri,
    type: isVideo ? 'video/mp4' : 'image/jpeg',
    name: isVideo ? 'story.mp4' : 'story.jpg',
  });

  const token = await retrieveData();
  const res = await fetch(API.SOCIAL_STORY_CREATE, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const err = new Error(errData?.data?.message || errData?.message || 'Story upload failed');
    err.data = errData;
    throw err;
  }
  return res.json();
};

// ----------- Chat -----------

export const getChatThreads = async (userId) => {
  return getAuth(API.SOCIAL_CHAT_THREADS(userId));
};

export const createOrGetChatThread = async (user1Id, user2Id) => {
  const url = urlWithParams(API.SOCIAL_CHAT_THREAD_CREATE(), { user1Id, user2Id });
  return postAuth(url, {});
};

export const getChatMessages = async (threadId, page = 0, size = 50) => {
  return getAuth(API.SOCIAL_CHAT_THREAD_MESSAGES(threadId, page, size));
};

export const sendChatMessage = async (threadId, senderId, clientMessageId, content, contentType = 'text') => {
  const url = API.SOCIAL_CHAT_SEND_MESSAGE();
  return postAuth(
    urlWithParams(url, { threadId, senderId, clientMessageId, contentType, content: content ?? '' }),
    {}
  );
};

export const getUnreadMessageCount = async (userId) => {
  return getAuth(API.SOCIAL_CHAT_UNREAD_COUNT(userId));
};

export const markChatThreadRead = async (threadId, userId) => {
  const url = urlWithParams(API.SOCIAL_CHAT_MARK_THREAD_READ(threadId), { userId });
  return postAuth(url, {});
};

// ----------- Notifications -----------

export const getNotifications = async (userId, page = 0, size = 20) => {
  return getAuth(API.SOCIAL_NOTIFICATIONS(userId, page, size));
};

export const getNotificationsCount = async (userId) => {
  return getAuth(API.SOCIAL_NOTIFICATIONS_COUNT(userId));
};

export const markNotificationsSeen = async (notificationIds) => {
  return putAuth(API.SOCIAL_NOTIFICATIONS_SEEN(), notificationIds ?? []);
};
