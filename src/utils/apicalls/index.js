import axios from 'axios';
import {getToken} from './tokenApi';

export const retrieveData = async () => {
  return getToken();
};

//test
export const getApi = async api => {
  const mytoken = await retrieveData();
  const config = {
    headers: {
      Authorization: 'Bearer ' + mytoken,
      'Content-Type': 'application/json',
    },
  };
  console.log({api, mytoken});
  return new Promise((resolve, reject) => {
    axios(api, config)
      .then(resolve)
      .catch(err => {
        reject(err.response);
        handleAuthorization(err.response?.status);
      });
  });
};

export const postApi = async (api, data) => {
  console.log(api, data);
  const mytoken = await retrieveData();
  const config = {
    headers: {
      Authorization: 'Bearer ' + mytoken,
      'Content-Type': 'application/json',
    },
  };
  return new Promise((resolve, reject) => {
    axios
      .post(api, data, config)
      .then(resolve)
      .catch(err => {
        reject(err.response);
        handleAuthorization(err.response?.status);
      });
  });
};

/**
 * Upload with optional progress callback.
 * @param {string} api - URL
 * @param {FormData} data - Form data
 * @param {{ onUploadProgress?: (e: { loaded: number, total?: number }) => void }} options - Optional; onUploadProgress(percentEvent) for progress bar
 */
export const uploadApi = async (api, data, options = {}) => {
  const mytoken = await retrieveData();
  const config = {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + mytoken,
    },
  };
  // Don't set Content-Type for FormData - let axios set multipart/form-data with boundary.
  // (data instanceof FormData) can fail in RN; check for append method instead.
  if (!data || typeof data.append !== 'function') {
    config.headers['Content-Type'] = 'application/json';
  }
  if (options.onUploadProgress) {
    config.onUploadProgress = options.onUploadProgress;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(api, data, config)
      .then(resolve)
      .catch(err => {
        reject(err.response);
        handleAuthorization(err.response?.status);
      });
  });
};

export const handleAuthorization = status => {
  console.log({status});
  if (status !== 401) {
    return;
  } else {
    // AsyncStorage.clear();
  }
};

export const tokenValidationHandle = async exp => {
  const currentDate = new Date();
  const tokenExpiryDate = new Date(exp);
  if (tokenExpiryDate > currentDate) {
    console.log('Token is still valid');
  } else {
    console.log('Token has expired');
    //await refreshToken();
  }
};
