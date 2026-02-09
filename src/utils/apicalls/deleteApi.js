import axios from 'axios';
import {
  getApiHeader,
  handleFailedResponse,
  handleSuccessResponse,
} from './apiHandler';

export const deleteAuth = (url) => deleteApi(url, true);
/** DELETE with query params (e.g. story delete: userId) */
export const deleteAuthWithParams = (url, params) => deleteApiWithParams(url, params, true);

const deleteApi = async (url, needToken = true) => {
  const config = await getApiHeader(needToken);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, config)
      .then(res => {
        handleSuccessResponse(res, resolve, reject);
      })
      .catch(err => {
        handleFailedResponse(err, reject);
      });
  });
};

const deleteApiWithParams = async (url, params = {}, needToken = true) => {
  const config = await getApiHeader(needToken);
  const fullConfig = { ...config, params };
  return new Promise((resolve, reject) => {
    axios
      .delete(url, fullConfig)
      .then(res => {
        handleSuccessResponse(res, resolve, reject);
      })
      .catch(err => {
        handleFailedResponse(err, reject);
      });
  });
};
