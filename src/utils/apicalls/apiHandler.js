import {setArchive} from '../../redux/reducers/Archive';
import {store} from '../../redux/store';
import {getToken} from './tokenApi';

export const getApiHeader = async needToken => {
  let mytoken;
  if (needToken) mytoken = await getToken();

 // console.log('-------------token------',mytoken)
  const config = {
    headers: {
      Authorization: 'Bearer ' + mytoken,
      'Content-Type': 'application/json',
    },
  };
  return config;
};

const sanitizeErrorMessage = (raw, status) => {
  if (raw == null) return null;
  const text = typeof raw === 'string' ? raw : raw?.description || raw?.message || null;
  if (!text || typeof text !== 'string') return null;
  // Tomcat / proxy HTML error pages should not be shown in the app UI
  if (/<html[\s>]/i.test(text) || /HTTP Status\s+\d+/i.test(text)) {
    if (status === 404) {
      return 'Server is temporarily unavailable. Please try again in a few minutes.';
    }
    return 'Something went wrong on the server. Please try again.';
  }
  return text.trim();
};

export const handleFailedResponse = (err, reject) => {
  const status = err.response?.status;
  const body = err.response?.data;
  const description =
    sanitizeErrorMessage(body, status) ||
    sanitizeErrorMessage(body?.description, status) ||
    sanitizeErrorMessage(body?.message, status) ||
    err.message ||
    'Something went wrong. Please try again.';
  reject({
    status,
    message: description,
    description,
    error: body?.error,
  });
};

export const handleSuccessResponse = (res, resolve, reject) => {
  const status = res?.status ?? 0;
  const is2xx = status >= 200 && status < 300;
  if (is2xx) {
    resolve(res.data);
  } else {
    reject({ status, message: res?.data?.message });
  }
};
