import {API} from '../endpoints';
import {postAuth} from './postApi';



  export const SaveCartData = async (RegistrationInfo) => {
    try {

        const url = API.SAVE_CART_DATA;
        const result = await postAuth(url, RegistrationInfo);
        console.log('---resilt----',result)
        return result;
      
    } catch (err) {
        console.log('sync Registration has error', err);
        return undefined;
    }
};




// const SaveCartData = async (params,utcDate) => {
//     try {
//       const url = API.SAVE_CART_DATA;
//       const result = await postAuth(url, params)
//         .then(data => {
//           setIsLoading(false)
//           if (!data?.error) {
//             setIsLoading(false);
//             Toast.show(data?.data?.message);
//             navigation.navigate(NAVIGATION.TO_HOME);
//        //   navigation.navigate(NAVIGATION.TO_QUEUESCREEN,{HoleId:HoleId,RegistrationDate:utcDate});
//         //  navigation.navigate('CourceCart', { HoleID:holeId ,CourseName:"courseName" ,HoleNumberParNumber:HoleNumberParNumber})
//           } else {
//          //   navigation.navigate(NAVIGATION.TO_QUEUESCREEN,{HoleId:HoleId,RegistrationDate:utcDate});
//             Toast.show(data?.description);
           
//           }
//         })
//         .catch(err => {
//           setIsLoading(false)
//           throw err;
//         });
//     } catch (err) {
//       setIsLoading(false)
//     }
//   };