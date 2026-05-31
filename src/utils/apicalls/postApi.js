import axios from 'axios';
import {
  getApiHeader,
  handleFailedResponse,
  handleSuccessResponse,
} from './apiHandler';

export const postAuth = (url, data) => post(url, data, true);
export const postNoAuth = (url, data) => post(url, data, false);

/** POST with Bearer auth — JSON body sent as-is (for Spring @RequestBody DTOs). Default postAuth wraps payload in { data: ... }. */
export const postAuthFlat = (url, body) => postFlat(url, body, true);

const postFlat = async (url, body, needToken = true) => {
  const config = await getApiHeader(needToken);
  return new Promise((resolve, reject) => {
    axios
      .post(url, body, config)
      .then(res => {
        handleSuccessResponse(res, resolve, reject);
      })
      .catch(err => {
        console.log('post api flat', url, 'catch', err);
        handleFailedResponse(err, reject);
      });
  });
};

const post = async (url, data, needToken = true) => {
  const request = {
    data: {data},
  };
  console.log('---------request------------', request.data);
  // console.log('post api--', url);
  const config = await getApiHeader(needToken);
  // console.log('---------url------------',url)
  return new Promise((resolve, reject) => {
    axios
      .post(url, request.data, config)
      .then(res => {
        //  console.log('post api', url, 'then-----------------', res.data)
        handleSuccessResponse(res, resolve, reject);
      })
      .catch(err => {
        console.log('post api', url, 'catch', err);
        handleFailedResponse(err, reject);
      });
  });
};
