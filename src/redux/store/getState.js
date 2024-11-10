import moment from 'moment';
import {store} from '.';
export const getLocationData = () => store.getState().location.data;


export const getProfileData = () => store.getState().profile?.data;

export const getUserId = () => store.getState().logindata?.data?.userId;

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

