import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {combineReducers} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import LoginReducer from '../reducers/Login';
import SaveCheckListReducer from '../reducers/SaveProfile';
import LogindataReducer from '../reducers/Logindata';
import profileReducer from '../reducers/Profile';
import imageReducer from '../reducers/Image';
import AllProfileReducer from '../reducers/AllProfile';
import locationReducer from '../reducers/location';
import EditChecklistReducer from '../reducers/editChecklistReducer';
import colorReducer from '../reducers/Course';
import VideoReducer from '../reducers/Video';
import PdfReducer from '../reducers/Pdf';
import ArchiveReducer from '../reducers/Archive';

const persistConfig = {
  key: 'observeNow',
  version: 1,
  storage: AsyncStorage,
};

const authPersistConfig = {
  key: 'Login',
  storage: AsyncStorage,
  whitelist: ['Login'],
};

const locationPersistConfig = {
  key: 'Location',
  storage: AsyncStorage,
  whitelist: ['Location'],
};

const AllProfilePersistConfig = {
  key: 'AllProfile',
  storage: AsyncStorage,
  whitelist: ['AllProfile'],
};

const ColorPersistConfig = {
  key: 'Course',
  storage: AsyncStorage,
  whitelist: ['Course'],
};

const logindataPersistConfig = {
  key: 'Logindata',
  storage: AsyncStorage,
  whitelist: ['Logindata'],
};

const profilePersistConfig = {
  key: 'Profile',
  storage: AsyncStorage,
  whitelist: ['Profile'],
};

const imagePersistConfig = {
  key: 'Image',
  storage: AsyncStorage,
  whitelist: ['Image'],
};

const savePersistConfig = {
  key: 'SaveProfile',
  storage: AsyncStorage,
  whitelist: ['SaveProfile'],
};

const VideoPersistConfig = {
  key: 'Video',
  storage: AsyncStorage,
  whitelist: ['Video'],
};

const PdfPersistConfig = {
  key: 'Pdf',
  storage: AsyncStorage,
  whitelist: ['Pdf'],
};

const rootReducer = combineReducers({
  login: persistReducer(authPersistConfig, LoginReducer),
  logindata: persistReducer(logindataPersistConfig, LogindataReducer),
  profile: persistReducer(profilePersistConfig, profileReducer),
  image: persistReducer(imagePersistConfig, imageReducer),
  saveProfile: persistReducer(savePersistConfig, SaveCheckListReducer),
  location: persistReducer(locationPersistConfig, locationReducer),
  allProfile: persistReducer(AllProfilePersistConfig, AllProfileReducer),
  course: persistReducer(ColorPersistConfig, colorReducer),
  video: persistReducer(VideoPersistConfig, VideoReducer),
  pdf: persistReducer(PdfPersistConfig, PdfReducer),
  archive: ArchiveReducer,
  editChecklist: EditChecklistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupListeners(store.dispatch);
