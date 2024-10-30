import {API} from '../endpoints';
import {store} from '../../redux/store/index';
import {setAllProfile, setCheckList} from '../../redux/reducers/AllProfile';
import {getAuth} from './getApi';
import {postAuth} from './postApi';
import {setProfile} from '../../redux/reducers/Profile';
import { setCourse } from '../../redux/reducers/Course';

export const getAllProfile = async () => {
  try {
    const url = API.GET_ALL_PROFILE;
    const params = {
      searchParams: {
        activeStatus: 'AC',
      },
    };

    const result = await postAuth(url, params)
      .then(data => {
      //  console.log('------all profile data-----', data);
        store.dispatch(setAllProfile(data));
        return data
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    console.log('sync getAllProfile has error', err);
  }
};




export const getAllCourse = async () => {
  try {
    const url = API.ALL_COURSE;
    const params = { };

    const result = await postAuth(url, params)
      .then(data => {
       console.log('------all course data-----------------', data);
        store.dispatch(setCourse(data));
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    console.log('sync getAllProfile has error', err);
  }
};

export const getUserProfile = async userId => {
  try {
    const url = API.GET_PROFILE_IMAGE;
    const params = {
      loginUserId: userId,
    };

    const result = await postAuth(url, params)
      .then(data => {
        store.dispatch(setProfile(data));
        getAllCourse();
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    console.log('sync getUserProfile has error', err);
  }
};

export const saveUserProfile = async () => {
  try {
    const loginData = store.getState();

    const url = API.GET_PROFILE_IMAGE;
    const params = {
      imageUrl: loginData?.userId,
    };

    // const result = await postAuth(url,params)
    //   .then(data => {
    //    store.dispatch(setProfile(data));

    //   })
    //   .catch(err => {
    //     throw err;
    //   });
  } catch (err) {
    console.log('sync getUserProfile has error', err);
  }
};

export const getProfileImage = async () => {
  try {
    const loginData = store.getState().logindata?.data;
    const url = API.FETCH_PROFILE;
    const params = {
      loginUserId: loginData?.userId,
    };

    const result = await postAuth(url, params)
      .then(data => {
        store.dispatch(setProfile(data));
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    console.log('sync getUserProfile has error', err);
  }
};
