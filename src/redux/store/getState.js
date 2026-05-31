import moment from 'moment';
import {store} from '.';
export const getLocationData = () => store.getState().location.data;


export const getProfileData = () => store.getState().profile?.data;

/** Same id source as PushNotificationBootstrap (login payload: { token, userId } from /api/auth/login). */
export const getUserId = () => {
  const d = store.getState().logindata?.data;
  if (d == null) return undefined;
  const id = d.userId ?? d.id;
  if (id == null || id === '') return undefined;
  const n = Number(id);
  return Number.isFinite(n) ? n : undefined;
};

export const convertdateinUTC = () => {
  const utcDate = moment.utc().format(); // Get current date and time in UTC, and format it
  return utcDate;
};
export const convertdateinUTCMMDDYY = () => {
  const utcDate = moment.utc().format('YYYY-MM-DD'); // Get current date and time in UTC, and format it
  return utcDate;
};
export const isUserLoggedIn = () => {
  const loginData = store.getState().login?.data;
  console.log('isUserLoggedIn', loginData, !!loginData);
  return !!loginData;
};

