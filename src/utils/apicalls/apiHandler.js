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

export const handleFailedResponse = (err, reject) => {
  //onsole.log('postApi res.status:catch', err.response?.data?.message);
  reject({
    status: err.response?.status,
    message: err.response?.data?.message,
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
