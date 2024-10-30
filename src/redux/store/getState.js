import {store} from '.';
export const getLocationData = () => store.getState().location.data;


export const getProfileData = () => store.getState().profile?.data;

export const isUserLoggedIn = () => {
  const loginData = store.getState().login?.data;
  console.log('isUserLoggedIn', loginData, !!loginData);
  return !!loginData;
};

