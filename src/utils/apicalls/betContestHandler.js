import { API } from "../endpoints";
import { getCurrentUTCDate } from "../helperfunctions/functions";
import { postAuth } from "./postApi";
export const getAllActiveChallenge = async (teeId) => {
    try {
        const url = API.DAILY_ACTIVE_CALLENGE;
        const date = getCurrentUTCDate();
        const params = {
            teeId: teeId, // Make sure you're using the passed `teeId`
            date: date,
        };
        // Await the result of the API call and directly assign it to a variable
        const result = await postAuth(url, params);
        // Explicitly return the expected data from the result
        return result?.data;
    } catch (err) {
        console.log('sync getAllActiveChallenge has error', err);
        return undefined; // Explicitly return undefined or handle error as needed
    }
};

export const saveCardActiveChallenge = async (data) => {
    try {        
        const url = API.SAVE_CART_DATA;
        const date = getCurrentUTCDate();
        const params = {
         //   teeId: teeId, // Make sure you're using the passed `teeId`
            date: date,
        };
    } catch (err) {
        console.log('sync getAllActiveChallenge has error', err);
        return undefined; // Explicitly return undefined or handle error as needed
    }
};


export const getAllCourseDetailList = async () => {
    try {
      const url = API.ALL_COURSE;
      const params = {};
      const result = await postAuth(url, params)
      return result;
    
  } catch (err) {
      console.log('sync getAllCourseDetailList has error', err);
      return undefined;
  }
};

export const getAllHoleByCourseId = async (couseId) => {
    try {
      const url = API.HOLE_BY_COURSEID;
      const params = {
        courseId:couseId
      };
      const result = await postAuth(url, params)
      return result;
    
    } catch (err) {
        console.log('sync getAllHoleByCourseId has error', err);
        return undefined;
    }
  };


  export const getAllTeeByHoleId = async (HoleId) => {
    try {
      const url = API.TEES_BY_HOLEID;
      const params = {
        holeId: HoleId,
      };
      const result = await postAuth(url, params)
      return result;
    
    } catch (err) {
        console.log('sync getAllTeeByHoleId has error', err);
        return undefined;
    }
  };