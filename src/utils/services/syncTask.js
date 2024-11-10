// import {syncTaskName} from './backgroundTaskEnum';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {getImageDatalength, getSavedChecklistbyNotStartedAndFailed} from '../../redux/store/getState';
// import { getAllCourse, getAllProfile, getUserProfile, saveUserProfile } from '../apicalls/profileHandler';

// const setSyncStatus = async taskName => {
//   const status = {lastSyncOn: new Date()};
//   await AsyncStorage.setItem(taskName + 'Status', JSON.stringify(status));
// };

// // export const syncProfile = async () => {
// //   getProfileData();
// //   await setSyncStatus(syncTaskName.syncProfile);
// // };

// // export const syncImage = async () => {
// //   getResponseImageData();
// //   await setSyncStatus(syncTaskName.syncImage);
// // };


// export const syncAllProfile = async () => {
//   getAllProfile();
//   await setSyncStatus(syncTaskName.syncAllProfile);
// };

// export const SyncAllCourse = async () => {
//   getAllCourse();
//   await setSyncStatus(syncTaskName.SyncAllCourse);
// };



// export const syncUserProfile = async (userId) => {
//   getUserProfile(userId);
//   await setSyncStatus(syncTaskName.syncUserProfile);
// };


// export const syncUpdateProfile = async () => {
//   saveUserProfile();
//   await setSyncStatus(syncTaskName.syncUserProfile);
// };

// // export const syncGetSavedChecklist = async () => {
// //   console.log('syncGetSavedChecklist executed');
// //   getSavedChecklist();
// //   await setSyncStatus(syncTaskName.syncGetSavedChecklist);
// // };

// // export const syncPostSavedChecklist = async isSyncInProgrss => {
// //   console.log('syncPostSavedChecklist executed');
// //   await saveChecklistfromRedux(isSyncInProgrss);
// //   await setSyncStatus(syncTaskName.syncPostSavedChecklist);
// // };

// // export const checkIfPendingSavedChecklistExists = async () => {
// //   const getSavedChecklistStartedAndFailed =
// //     getSavedChecklistbyNotStartedAndFailed(true);

// //   // console.log(
// //   //   'checkIfPendingSavedChecklistExists',
// //   //   getSavedChecklistStartedAndFailed?.length > 0,
// //   // );

// //   return getSavedChecklistStartedAndFailed?.length > 0;
// // };
// // export const checkIfImageDataExits = async () => {
// //   const getImageData =
// //   getImageDatalength();
// //   return getImageData > 0;
// // };