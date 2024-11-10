// import BackgroundService from 'react-native-background-actions';
// import {syncTaskName} from './backgroundTaskEnum';
// import {
//   SyncAllCourse,
//   syncAllProfile,
//   syncProfile,
//   syncUpdateProfile,
//   syncUserProfile,
// } from './syncTask';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
// import {getMasterChecklist, isUserLoggedIn} from '../../redux/store/getState';

// /* ***************************/
// const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
// const defaultDelay = 1 * 60 * 1000;
// const isNotToday = date => {
//   const today = new Date();
//   const iDate = new Date(date);

//   return (
//     iDate.getDate() !== today.getDate() ||
//     iDate.getMonth() !== today.getMonth() ||
//     iDate.getFullYear() !== today.getFullYear()
//   );
// };

// /* ***************************/
// const stopAllBackgroundServices = async () => {
//   console.log('stopAllBackgroundServices Invoked');
//   await BackgroundService.stop();
// };



// const executeTask = async taskDataArguments => {
//   const {taskName} = taskDataArguments;
//   console.log('taskname', taskName);
//   const syncAll = taskName == syncTaskName.all;

//   console.log(
//     'executeTask Invoked: taskName ' + taskName == undefined ? taskName : 'ALL',
//   );

//   await new Promise(async resolve => {
//     let isAnythingPendingForSync = false;
//     for (let i = 0; BackgroundService.isRunning(); i++) {
//       console.log('iterating: ' + i);
//       if (!isUserLoggedIn()) {
//         console.log('Exit background service as user is not logged in');
//         stopAllBackgroundServices();
//         resolve();
//         break;
//       }
//       const netInfoState = await NetInfo.fetch();
//       if (netInfoState.isConnected) {
//         try {
//           // let isSyncProfile = taskName == syncTaskName.syncProfile || syncAll;
//           // console.log('syncnall', syncAll);
//           let isSyncAllProfile = taskName == syncTaskName.syncAllProfile || syncAll;
//           console.log('isSyncAllProfile', isSyncAllProfile);

//           let isSyncUserProfile = taskName == syncTaskName.syncUserProfile || syncAll;

//           let isSyncAllCourse  = taskName == syncTaskName.SyncAllCourse || syncAll;
      
//           // if (isSyncProfile) {
//           //   console.log('executing sync profile');
//           //   await syncProfile();
//           // }  
//            if (isSyncAllProfile) {
//             console.log('executing sync all profile');
//             await syncAllProfile();
//           }
//           if (isSyncAllCourse) {
//             console.log('executing sync all profile');
//             await SyncAllCourse();
//           }

//           if (isSyncUserProfile) {
//             console.log('executing sync user profile');
//             await syncUserProfile();
//           }
//           if (isSyncUpdateProfile) {
//             console.log('executing sync user profile');
//             await syncUpdateProfile();
//           }
//           //  isAnythingPendingForSync = false;
//             console.log('sync completed');
//             await stopAllBackgroundServices();
//             resolve();
          
//         } catch (err) {
//           console.log(err);
//           await stopAllBackgroundServices();
//           resolve();
//         }
//       } else {
//         console.log('Internet not available');
//         await sleep(defaultDelay);
//       }
//     }
//   });
// };

// const startBackgroundService = async taskName => {
//   console.log('startBackgroundService Invoked: taks--- ' + taskName);
//   if (!isUserLoggedIn()) {
//     console.log('Do not start background service as user is not logged in');
//     stopAllBackgroundServices();
//     return;
//   }

//   const options = {
//     taskName: 'NiApp',
//     taskTitle: 'NI application background sync process',
//     taskDesc: 'NI application background sync process',
//     taskIcon: {
//       name: 'ic_launcher',
//       type: 'mipmap',
//     },
//     // color: '#ff00ff',
//     //  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
//     parameters: {
//       taskName: taskName,
//     },
//   };
//   console.log('BackgroundService.isRunning()', BackgroundService.isRunning());
//   if (!BackgroundService.isRunning()) {
//     console.log('Starting the background service: task');
//     await BackgroundService.start(executeTask, options);
//   }
// };

// const reStartBackgroundService = async taskName => {
//   console.log('reStartBackgroundService invoked');
//   await stopAllBackgroundServices();
//   await startBackgroundService(taskName);
// };

// const IsBackgroundSyncRunning = () => {
//   console.log('BackgroundService.isRunning()', BackgroundService.isRunning());
//   return BackgroundService.isRunning();
// };

// export {
//   startBackgroundService,
//   stopAllBackgroundServices,
//   reStartBackgroundService,
//   IsBackgroundSyncRunning,
// };
