import {
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';




export const getCurrentUTCDate = () => {
  const date = new Date(); // Get current date
  const year = date.getUTCFullYear(); // Get the UTC year
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get UTC month and add leading zero if needed
  const day = String(date.getUTCDate()).padStart(2, '0'); // Get UTC day and add leading zero if needed
  return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
};


export const sleep = time =>
  new Promise(resolve => setTimeout(() => resolve(), time));

  export const historyDownload = async (title, url) => {
    if (Platform.OS === 'ios') {
      const data = downloadHistory(title, url);
      return data;
    } else {
      if (Platform.OS === 'android' && Platform.constants['Release'] >= 13) {
       // alert('No need take to permission For andrid 13');
        const data = downloadHistory(title, url);
        return data;
      } else {
        try {
          return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              ttitle: 'Storage Permission',
              message:
                'Nutrition International needs access to your external storage ' +
                'so you can save your downloaded files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('--permission granted---')
              //Once user grant the permission start downloading
              const data = downloadHistory(title, url);
              return data;
            } else {
              //If permission denied then show alert 'Storage Permission
              alert('Permission not granted, Please take permission');
            }
          });
        } catch (err) {
          //To handle permission related issue
        }
      }
    }
  };
  
  const downloadHistory = async (title, url) => {
    let date = new Date();
    const {dirs} = ReactNativeBlobUtil.fs;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: title,
        mime: 'application/pdf',
        appendExt: 'pdf',
        description: title,
        path: `${dirs.DownloadDir}/${title}-${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}`,
      },
    };
  
    return ReactNativeBlobUtil.config(options)
      .fetch('GET', url)
      .then(res => {
        // android.actionViewIntent(res.path(), 'application/pdf')
        return res;
      })
      .catch(e => {
        alert('Error');
      });
  };
