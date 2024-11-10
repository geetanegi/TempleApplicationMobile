import { getUserId } from '../../redux/store/getState';
import {API} from '../endpoints';
import {postAuth} from './postApi';

export const getUserProfileById = async (userId) => {
  try {
    const url = API.FETCH_PROFILE;
    const params = {
      loginUserId: userId,
    };
    const result = await postAuth(url, params);
    return result;

} catch (err) {
    console.log('sync getUserProfileById has error', err);
    return undefined;
}
};