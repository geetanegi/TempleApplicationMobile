import { API } from '../endpoints';
import { postAuth, postSearchAuth } from './postApi';
import { convertdateinUTC, convertdateinUTCMMDDYY, getUserId } from '../../redux/store/getState';
import { CopyMinus } from 'lucide-react-native';

export const getAllVideos = async () => {
  try {
    const url = API.CHECK_QUEUE_COUNT;
    const todaysDateinUTC = convertdateinUTC();
    const userId = getUserId();
    const params = {
    // status:"APPROVED",
    // playerUser.id":"1"
    };
    const result = await postAuth(url, params);
   console.log('--quueee checkkk------',result)
    return result;

  } catch (err) {
    console.log('sync Registration has error', err);
    return undefined;
  }
};



export const getAllShotOftheWeek = async () => {
    try {
      const url = API.ALL_SHOT_OF_THE_WEEK;
      const todaysDateinUTC = convertdateinUTC();
      const userId = getUserId();
      const searchParams = {
        "player.id": userId, 
        isPublished: true
      };
      const result = await postAuth(url, searchParams);
      return result;
  
    } catch (err) {
      console.log('sync Registration has error', err);
      return undefined;
    }
  };

  export const getAllPublishedVideo = async () => {
    try {
      const url = API.GET_ALL_PUBLISHED_VIDEO;
      const userId = getUserId();
      const params = {
        searchParams:{
            "playerUser.id": userId, 
            isPublished: true,
            status: "APPROVED"
        }   
      };
    //  console.log('-----resilt--------result',params)
      const result = await postAuth(url, params);

     
      return result;
  
    } catch (err) {
      console.log('sync getAllPublishedVideo has error', err);
      return undefined;
    }
  };
  export const getAllRequestedVideo = async () => {
    try {
      const url = API.GET_ALL_REQUEST_HIGHLIGHT_VIDEO;
      const userId = getUserId();
      const todaysDateinUTC = convertdateinUTCMMDDYY();
      console.log('----todaysDateinUTCtodaysDateinUTCtodaysDateinUTC',todaysDateinUTC)
      const params = {
      date: todaysDateinUTC,
      playerId: userId
      };
    //  console.log('-----resilt--------result',params)
      const result = await postAuth(url, params);

     
      return result;
  
    } catch (err) {
      console.log('sync getAllPublishedVideo has error', err);
      return undefined;
    }
  };
  export const getAllVideo = async () => {
    try {
      const url = API.ALL_APPROVED_REQ_VIDEO;
      const userId = getUserId();
      const params = {
        searchParams:{
            "playerUser.id": userId,
            status: "APPROVED"
        }   
      };
     console.log('-----resilt--------result',params)
      const result = await postAuth(url, params);

     
      return result;
  
    } catch (err) {
      console.log('sync getAllPublishedVideo has error', err);
      return undefined;
    }
  };

  export const unpublishData = async (requestVideoId) => {
    try {
      const url = API.UNPUBLISH_DATA;
      const params = {
        isPublished:false,
        requestVideoId: requestVideoId
      };
     console.log('-----unpublishData--',params)
      const result = await postAuth(url, params);
      return result;
  
    } catch (err) {
      console.log('sync unpublishData has error', err);
      return undefined;
    }
  };
  
  