import axios from 'axios';
import {
  getApiHeader,
  handleFailedResponse,
  handleSuccessResponse,
} from './apiHandler';

export const getAuth = url => get(url, true);
export const getNoAuth = url => get(url, false);
/** GET with query params (e.g. for social APIs). params = { key: value } */
export const getAuthWithParams = (url, params) => getWithParams(url, params, true);

const get = async (url, needToken = true) => {
  const config = await getApiHeader(needToken);
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then(res => {
        handleSuccessResponse(res, resolve, reject);
      })
      .catch(err => {
        handleFailedResponse(err, reject);
      });
  });
};

const getWithParams = async (url, params = {}, needToken = true) => {
  const config = await getApiHeader(needToken);
  const fullConfig = { ...config, params };
  return new Promise((resolve, reject) => {
    axios
      .get(url, fullConfig)
      .then(res => {
        handleSuccessResponse(res, resolve, reject);
      })
      .catch(err => {
        handleFailedResponse(err, reject);
      });
  });
};
