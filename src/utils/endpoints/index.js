import {environment} from '../constant';

class Endpoints {
  baseUrl = environment.baseUrl;
  LOGIN_AUTH = this.baseUrl + 'auth/login';
  LOGOUT = this.baseUrl + 'auth/logout';
  REGISTER_USER = this.baseUrl + 'auth/register';
  VERIFY_LOGIN_OTP=this.baseUrl + 'identity/auth/verify-password-otp';
  VERIFY_OTP= this.baseUrl + 'identity/auth/verify-login-otp';
  FORGET_PASSWORD=this.baseUrl + 'api/auth/forgot-password';
  RESET_PASSWORD=this.baseUrl + 'identity/auth/reset-password';
  FORGET_REGISTER_USER_PASSWORD=this.baseUrl + 'identity/auth/forgot-register-user-password';
  GET_ALL_PROFILE=this.baseUrl + 'core/user/all-active-players';
  UPDATE_PROFILE=this.baseUrl +'core/user/update-profile';
  UPDATE_PIC=this.baseUrl+'core/user/update-profile-pic';
  FETCH_PROFILE=this.baseUrl+'core/user/fetch-profile';
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
  SOCIAL_POSTS = this.socialBase + 'posts';
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
  SOCIAL_COMMENTS_BY_USER = (userId) => this.socialBase + `comments/user/${userId}`;
  SOCIAL_SHARE = () => this.socialBase + 'share';
  SOCIAL_UNSHARE = () => this.socialBase + 'unshare';
  SOCIAL_POST_SHARES_COUNT = (postId) => this.socialBase + `post/${postId}/shares/count`;
  SOCIAL_POST_IS_SHARED = (postId) => this.socialBase + `post/${postId}/shares/is-shared`;

  // npm i react-native-picker-select --legacy-peer-deps
}

export const API = new Endpoints();
