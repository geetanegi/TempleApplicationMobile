import { API_CONSTANTS } from '../../global/theme';
import { API } from '../endpoints';
import { postAuth } from './postApi';

export const getAllPlayerList = async () => {
    try {
        const url = API.GET_ALL_PROFILE;
        const params = {
            searchParams: {
                activeStatus: API_CONSTANTS.AC,
            },
        };
        const result = await postAuth(url, params);
        return result;

    } catch (err) {
        console.log('sync getAllPlayerList has error', err);
        return undefined;
    }
};

