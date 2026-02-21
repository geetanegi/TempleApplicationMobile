import ReactNativeBlobUtil from 'react-native-blob-util';
import { API } from '../endpoints';
import { getAuth, getAuthWithParams } from './getApi';
import { postAuth } from './postApi';
import { deleteAuthWithParams } from './deleteApi';
import { getToken } from './tokenApi';

const urlWithParams = (baseUrl, params) => {
  const search = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return search ? `${baseUrl}?${search}` : baseUrl;
};

export const getRandomReels = async (page = 0, size = 10, currentUserId = null) => {
  const params = { page, size };
  if (currentUserId != null) params.currentUserId = currentUserId;
  const url = urlWithParams(API.SOCIAL_REELS(), params);
  return getAuth(url);
};

export const getUserReels = async (userId, currentUserId = null) => {
  const url = urlWithParams(API.SOCIAL_REELS_BY_USER(userId), { currentUserId });
  return getAuth(url);
};

export const getReelById = async (reelId, currentUserId = null) => {
  const url = urlWithParams(API.SOCIAL_REEL_BY_ID(reelId), { currentUserId });
  return getAuth(url);
};

/**
 * Use ReactNativeBlobUtil.fetch for upload - it natively handles content:// URIs
 * (axios FormData can trigger "For input string: 9223372036854775807" on Android
 * when parsing MediaStore IDs from gallery URIs).
 */
export const createReel = async (userId, caption, fileUri, options = {}) => {
  if (!fileUri || typeof fileUri !== 'string' || !fileUri.trim()) {
    throw new Error('Invalid video URI');
  }
  const token = await getToken();
  if (!token) throw new Error('Not authenticated');

  const thumbnailUri = options.thumbnailUri;
  const body = [
    { name: 'userId', data: String(userId) },
    ...(caption != null && caption.trim() !== '' ? [{ name: 'caption', data: caption.trim() }] : []),
    {
      name: 'video',
      filename: 'reel.mp4',
      type: 'video/mp4',
      data: ReactNativeBlobUtil.wrap(fileUri.trim()),
    },
    ...(thumbnailUri && typeof thumbnailUri === 'string' && thumbnailUri.trim()
      ? [{
          name: 'thumbnail',
          filename: 'thumbnail.jpg',
          type: 'image/jpeg',
          data: ReactNativeBlobUtil.wrap(thumbnailUri.trim()),
        }]
      : []),
  ];

  const task = ReactNativeBlobUtil.fetch(
    'POST',
    API.SOCIAL_REEL_CREATE,
    {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body
  );

  if (options.onUploadProgress) {
    task.uploadProgress({ interval: 250 }, (written, total) => {
      const percent = total > 0 ? Math.round((written / total) * 100) : 0;
      options.onUploadProgress(percent);
    });
  }

  const resp = await task;
  if (resp.respInfo.status >= 200 && resp.respInfo.status < 300) {
    try {
      return { data: resp.json ? resp.json() : {} };
    } catch {
      return { data: {} };
    }
  }
  let errMsg = 'Failed to post reel';
  try {
    const json = resp.json?.();
    if (json?.message) errMsg = json.message;
  } catch {}
  throw new Error(errMsg);
};

export const deleteReel = async (reelId, userId) => {
  return deleteAuthWithParams(API.SOCIAL_REEL_DELETE(reelId), { userId });
};

export const likeReel = async (reelId, userId) => {
  return postAuth(urlWithParams(API.SOCIAL_REEL_LIKE(reelId), { userId }), {});
};

export const unlikeReel = async (reelId, userId) => {
  return postAuth(urlWithParams(API.SOCIAL_REEL_UNLIKE(reelId), { userId }), {});
};

export const commentOnReel = async (reelId, userId, content, parentCommentId = null) => {
  const params = { userId, content };
  if (parentCommentId != null) params.parentCommentId = parentCommentId;
  return postAuth(urlWithParams(API.SOCIAL_REEL_COMMENT(reelId), params), {});
};

export const getReelComments = async (reelId) => {
  return getAuth(API.SOCIAL_REEL_COMMENTS(reelId));
};

export const deleteReelComment = async (reelId, commentId, userId) => {
  return deleteAuthWithParams(API.SOCIAL_REEL_COMMENT_DELETE(reelId, commentId), { userId });
};

export const shareReel = async (reelId, userId) => {
  return postAuth(urlWithParams(API.SOCIAL_REEL_SHARE(reelId), { userId }), {});
};

export const unshareReel = async (reelId, userId) => {
  return postAuth(urlWithParams(API.SOCIAL_REEL_UNSHARE(reelId), { userId }), {});
};
