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
        // Await the result of the API call and directly assign it to a variable
        // const result = await postAuth(url, params);
        // Explicitly return the expected data from the result
       // return result?.data;
    } catch (err) {
        console.log('sync getAllActiveChallenge has error', err);
        return undefined; // Explicitly return undefined or handle error as needed
    }
};
