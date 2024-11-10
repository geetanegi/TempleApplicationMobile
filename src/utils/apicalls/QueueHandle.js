import { API } from '../endpoints';
import { postAuth } from './postApi';
import { convertdateinUTC, getUserId } from '../../redux/store/getState';

export const checkRegistration = async (holeId) => {
  try {
    const userId = getUserId();
    const todaysDateinUTC = convertdateinUTC();
    const url = API.CHECK_REGISTRATION;
    const params = {
      holeId: holeId,
      teeId: null,
      playerId: userId,
      registrationDate: todaysDateinUTC,
    };
    console.log('--params====',params)
    const result = await postAuth(url, params);
    console.log('----check result---',result)
    return result;

  } catch (err) {
    console.log('sync Registration has error', err);
    return undefined;
  }
};

export const checkQueueCount = async (holeId) => {
  try {
    const url = API.CHECK_QUEUE_COUNT;
    const todaysDateinUTC = convertdateinUTC();
    const userId = getUserId();
    const params = {
      holeId: holeId,
      teeId: null,
      playerId: userId,
      registrationDate: todaysDateinUTC,
    };
    const result = await postAuth(url, params);
   console.log('--quueee checkkk------',result)
    return result;

  } catch (err) {
    console.log('sync Registration has error', err);
    return undefined;
  }
};



export const saveRecordResult = async (params) => {
  try {
    const url = API.RECORD_RESULT;
    const result = await postAuth(url, params);
    return result;

  } catch (err) {
    console.log('sync Registration has error', err);
    return undefined;
  }
};

export const addPlayertoQueue = async (params) => {
  try {
    const url = API.ADD_PLAYER_QUEUE;
    const result = await postAuth(url, params);
    console.log('-----add player to ques--result',result)
    return result;


  } catch (err) {
    console.log('sync Registration has error', err);
    return undefined;
  }
};

