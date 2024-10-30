import {environment} from '../constant';

class Endpoints {
  baseUrl = environment.baseUrl;
  LOGIN_AUTH = this.baseUrl + 'identity/auth/login';
  REGISTER_USER = this.baseUrl + 'identity/auth/register-new-user';
  VERIFY_LOGIN_OTP=this.baseUrl + 'identity/auth/verify-password-otp';
  VERIFY_OTP= this.baseUrl + 'identity/auth/verify-login-otp';
  FORGET_PASSWORD=this.baseUrl + 'identity/auth/forgot-password';
  RESET_PASSWORD=this.baseUrl + 'identity/auth/reset-password';
  FORGET_REGISTER_USER_PASSWORD=this.baseUrl + 'identity/auth/forgot-register-user-password';
  GET_ALL_PROFILE=this.baseUrl + 'core/user/all-active-players';
  GET_PROFILE_IMAGE=this.baseUrl +'core/user/fetch-profile';
  UPDATE_PROFILE=this.baseUrl +'core/user/update-profile';
  UPDATE_PIC=this.baseUrl+'core/user/update-profile-pic';
  FETCH_PROFILE=this.baseUrl+'core/user/fetch-profile';
  ALL_COURSE=this.baseUrl+'core/course/courses';
  HOLE_BY_COURSEID=this.baseUrl+'core/hole/hole-by-courseId';
  TEES_BY_HOLEID=this.baseUrl+'core/tee/tee-by-holeId';
  DAILY_ACTIVE_CALLENGE= this.baseUrl+'core/contest/get-daily-active-contest';
  SAVE_CART_DATA=this.baseUrl+'core/registration/save';
  VERSION = this.baseUrl;

  // npm i react-native-picker-select --legacy-peer-deps
}

export const API = new Endpoints();
