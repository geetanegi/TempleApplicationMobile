import {environment} from '../constant';

class Endpoints {
  baseUrl = environment.baseUrl;
  LOGIN_AUTH = this.baseUrl + 'auth/login';
  LOGOUT = this.baseUrl + 'auth/logout';
  REGISTER_USER = this.baseUrl + 'auth/register';
  VERIFY_REGISTER_OTP = this.baseUrl + 'auth/verify-register-otp';
  VERIFY_LOGIN_OTP = this.baseUrl + 'auth/verify-forgot-otp';
  VERIFY_OTP = this.baseUrl + 'auth/verify-register-otp';
  RESEND_REGISTER_OTP = this.baseUrl + 'auth/resend-register-otp';
  FORGET_PASSWORD = this.baseUrl + 'auth/forgot-password';
  VERIFY_FORGOT_OTP = this.baseUrl + 'auth/verify-forgot-otp';
  RESET_PASSWORD = this.baseUrl + 'auth/reset-password';
  CHECK_USERNAME = (username) =>
    this.baseUrl.replace(/\/api\/?$/, '/') + `user/social/profile/check-username?username=${encodeURIComponent(username)}`;
  CHECK_EMAIL = (email) =>
    this.baseUrl.replace(/\/api\/?$/, '/') + `user/social/profile/check-email?email=${encodeURIComponent(email)}`;
  FORGET_REGISTER_USER_PASSWORD=this.baseUrl + 'identity/auth/forgot-register-user-password';
  GET_ALL_PROFILE=this.baseUrl + 'core/user/all-active-players';
  UPDATE_PROFILE=this.baseUrl +'core/user/update-profile';
  UPDATE_PIC=this.baseUrl+'core/user/update-profile-pic';
  FETCH_PROFILE=this.baseUrl+'user/fetch-profile';
  ALL_COURSE=this.baseUrl+'core/course/courses';
  HOLE_BY_COURSEID=this.baseUrl+'core/hole/hole-by-courseId-without-tee';
  TEES_BY_HOLEID=this.baseUrl+'core/tee/tee-by-holeId';
  DAILY_ACTIVE_CALLENGE= this.baseUrl+'core/contest/get-daily-active-contest';
  SAVE_CART_DATA=this.baseUrl+'core/registration/save';
  CHECK_REGISTRATION=this.baseUrl+'core/player-contest/check-register';
  ADD_PLAYER_QUEUE=this.baseUrl+'core/player-contest/add-player-queue';
  CHECK_QUEUE_COUNT=this.baseUrl+'core/player-contest/check-queue';
  RECORD_RESULT= this.baseUrl +'core/player-contest/record-result';
  ALL_SHOT_OF_THE_WEEK=this.baseUrl+'core/shot-of-the-week/all-shot-of-the-week';
  GET_ALL_PUBLISHED_VIDEO= this.baseUrl+'core/request-video/all-published-videos';
  GET_ALL_REQUEST_HIGHLIGHT_VIDEO=this.baseUrl+'core/record/player-request-highlight';
  ALL_APPROVED_REQ_VIDEO=this.baseUrl+'core/request-video/all-approved-req-videos';
  UNPUBLISH_DATA=this.baseUrl+'core/request-video/published';
  VERSION = this.baseUrl;

  // Social media (backend is at /jain-app/user/social, not under /api)
  get socialBase() {
    return this.baseUrl.replace(/\/api\/?$/, '/') + 'user/social/';
  }
  SOCIAL_FOLLOW = () => this.socialBase + 'follow';
  SOCIAL_UNFOLLOW = () => this.socialBase + 'unfollow';
  SOCIAL_FOLLOWERS = (userId) => this.socialBase + `followers/${userId}`;
  SOCIAL_FOLLOWING = (userId) => this.socialBase + `following/${userId}`;
  SOCIAL_FOLLOWERS_COUNT = (userId) => this.socialBase + `followers/count/${userId}`;
  SOCIAL_FOLLOWING_COUNT = (userId) => this.socialBase + `following/count/${userId}`;
  SOCIAL_IS_FOLLOWING = () => this.socialBase + 'is-following';
  /** Profile by userId (same auth as social; use this for profile screen) */
  SOCIAL_PROFILE = (userId) => this.socialBase + `profile/${userId}`;
  /** Update profile (firstName, lastName, description, location, contactNumber, alternateEmail) */
  SOCIAL_PROFILE_UPDATE = this.socialBase + 'profile/update';
  /** Update profile picture (multipart file) */
  SOCIAL_PROFILE_PICTURE = this.socialBase + 'profile/picture';
  SOCIAL_CHECK_USERNAME = (username, userId) =>
    this.socialBase + `profile/check-username?username=${encodeURIComponent(username)}${userId ? `&userId=${userId}` : ''}`;
  SOCIAL_POSTS = this.socialBase + 'posts';
  SOCIAL_POST_CREATE = this.socialBase + 'post';
  SOCIAL_POST_DELETE = (postId) => this.socialBase + `post/${postId}`;
  SOCIAL_POSTS_BY_USER = (userId) => this.socialBase + `posts/${userId}`;
  SOCIAL_POST_BY_ID = (postId) => this.socialBase + `post/${postId}`;
  SOCIAL_POSTS_BY_TEMPLE = (templeId) => this.socialBase + `temple/${templeId}/posts`;
  SOCIAL_LIKE = () => this.socialBase + 'like';
  SOCIAL_UNLIKE = () => this.socialBase + 'unlike';
  SOCIAL_POST_LIKES_COUNT = (postId) => this.socialBase + `post/${postId}/likes/count`;
  SOCIAL_POST_LIKES_USERS = (postId) => this.socialBase + `post/${postId}/likes/users`;
  SOCIAL_POST_IS_LIKED = (postId) => this.socialBase + `post/${postId}/likes/is-liked`;
  SOCIAL_POST_COMMENT = (postId) => this.socialBase + `post/${postId}/comment`;
  SOCIAL_POST_COMMENTS = (postId) => this.socialBase + `post/${postId}/comments`;
  SOCIAL_POST_COMMENTS_COUNT = (postId) => this.socialBase + `post/${postId}/comments/count`;
  SOCIAL_DELETE_COMMENT = (postId, commentId) => this.socialBase + `post/${postId}/comment/${commentId}`;
  SOCIAL_COMMENTS_BY_USER = (userId) => this.socialBase + `comments/user/${userId}`;
  SOCIAL_SHARE = () => this.socialBase + 'share';
  SOCIAL_UNSHARE = () => this.socialBase + 'unshare';
  SOCIAL_POST_SHARES_COUNT = (postId) => this.socialBase + `post/${postId}/shares/count`;
  SOCIAL_POST_IS_SHARED = (postId) => this.socialBase + `post/${postId}/shares/is-shared`;

  // Chat
  SOCIAL_CHAT_THREADS = (userId) => this.socialBase + `chat/threads?userId=${userId}`;
  SOCIAL_CHAT_THREAD_CREATE = () => this.socialBase + 'chat/thread';
  SOCIAL_CHAT_THREAD_MESSAGES = (threadId, page = 0, size = 50) =>
    this.socialBase + `chat/thread/${threadId}/messages?page=${page}&size=${size}`;
  SOCIAL_CHAT_SEND_MESSAGE = () => this.socialBase + 'chat/message';
  SOCIAL_CHAT_UNREAD_COUNT = (userId) => this.socialBase + `chat/unread-count?userId=${userId}`;
  SOCIAL_CHAT_MARK_THREAD_READ = (threadId) => this.socialBase + `chat/thread/${threadId}/read`;
  // Notifications (social)
  SOCIAL_NOTIFICATIONS = (userId, page = 0, size = 20) =>
    this.socialBase + `notifications?userId=${userId}&page=${page}&size=${size}`;
  SOCIAL_NOTIFICATIONS_COUNT = (userId) => this.socialBase + `notifications/count?userId=${userId}`;
  SOCIAL_NOTIFICATIONS_SEEN = () => this.socialBase + 'notifications/seen';
  /** POST body: { userId, token, platform } — register for FCM push (implement on backend) */
  SOCIAL_FCM_REGISTER = () => this.socialBase + 'notifications/device/fcm';

  // Stories
  SOCIAL_STORY_CREATE = this.socialBase + 'story';
  SOCIAL_STORY_DELETE = (storyId) => this.socialBase + `story/${storyId}`;
  SOCIAL_STORY_BY_USER = (userId) => this.socialBase + `story/user/${userId}`;
  SOCIAL_STORY_FEED = this.socialBase + 'story/feed';
  SOCIAL_STORY_ADD_VIEW = (storyId) => this.socialBase + `story/${storyId}/view`;
  SOCIAL_STORY_VIEWED = (storyId) => this.socialBase + `story/${storyId}/viewed`;

  // Reels
  SOCIAL_REELS = () => this.socialBase + 'reels';
  SOCIAL_REELS_FEED = () => this.socialBase + 'reels/feed';
  SOCIAL_REELS_BY_USER = (userId) => this.socialBase + `reels/user/${userId}`;
  SOCIAL_REEL_CREATE = this.socialBase + 'reel';
  SOCIAL_REEL_DELETE = (reelId) => this.socialBase + `reel/${reelId}`;
  SOCIAL_REEL_BY_ID = (reelId) => this.socialBase + `reel/${reelId}`;
  SOCIAL_REEL_LIKE = (reelId) => this.socialBase + `reel/${reelId}/like`;
  SOCIAL_REEL_UNLIKE = (reelId) => this.socialBase + `reel/${reelId}/unlike`;
  SOCIAL_REEL_COMMENT = (reelId) => this.socialBase + `reel/${reelId}/comment`;
  SOCIAL_REEL_COMMENTS = (reelId) => this.socialBase + `reel/${reelId}/comments`;
  SOCIAL_REEL_COMMENT_DELETE = (reelId, commentId) => this.socialBase + `reel/${reelId}/comment/${commentId}`;
  SOCIAL_REEL_SHARE = (reelId) => this.socialBase + `reel/${reelId}/share`;
  SOCIAL_REEL_UNSHARE = (reelId) => this.socialBase + `reel/${reelId}/unshare`;

  // Temple APIs (jain-app at /user/temples)
  get templeBase() {
    return this.baseUrl.replace(/\/api\/?$/, '/') + 'user/temples/';
  }
  TEMPLE_LIST = () => this.templeBase + 'list';
  TEMPLE_LOCATE = () => this.templeBase + 'locate';
  TEMPLE_VIEW = (id) => this.templeBase + `${id}/view`;
  TEMPLE_POPULAR = () => this.templeBase + 'popular';
  TEMPLE_TRENDING = () => this.templeBase + 'trending';

  // User search (whole user master: normal + temple users). POST with searchParams + pageSortingParam.
  get userBase() {
    return this.baseUrl.replace(/\/api\/?$/, '/') + 'user/';
  }
  USER_SEARCH = () => this.userBase + 'all-player-user';

  // Feedback
  get feedbackBase() {
    return this.baseUrl.replace(/\/api\/?$/, '/') + 'user/feedback/';
  }
  FEEDBACK_SUBMIT = () => this.feedbackBase + 'submit';

  // npm i react-native-picker-select --legacy-peer-deps
}

export const API = new Endpoints();
