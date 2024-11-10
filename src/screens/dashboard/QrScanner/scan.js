import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { checkRegistration } from '../../../utils/apicalls/QueueHandle';

const QRCodeScanner = ({ navigation }) => {
  const [scanned, setScanned] = useState(false); // Track whether a QR code has been scanned
  const [scannedData, setScannedData] = useState(null); // Store extracted data


  useEffect(() => {
    setScanned(false)
   // console.log('--useEFeect')
  }, []);

  // Data fetch when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      setScanned(false)
   //   console.log('-----useFocusEffetc---')
      return () => {
        // Cleanup if necessary
      };
    }, [])
  );
  const handleCheckRegistration = async (holeId) => {
    try {
      const course1 = await checkRegistration(holeId);
      return course1; // This will return the resolved data
    } catch (error) {
      console.error("Error in handleCheckRegistration:", error); // Handle any errors
      return null; // Optionally return a fallback value on error
    }
  };

 


 
  
  const handleQRCodeRead = async (e) => {
    if (scanned) return; // If already scanned, do nothing
    setScanned(true); // Mark as scanned to prevent further scanning
    const scannedUrl = e.data;
    console.log('-----scanner', scannedUrl)

    if (!scannedUrl || typeof scannedUrl !== 'string') {
      Alert.alert('Error', 'Scanned data is not a valid URL');
      setScanned(false); // Allow rescan if an error occurs
      return;
    }
    try {
      // Check if the URL contains a query string
      if (!scannedUrl.includes('?')) {
        throw new Error('No query string found in the scanned URL');
      }
      const queryString = scannedUrl.split('?')[1];
      if (!queryString) {
        throw new Error('No valid query parameters found');
      }
      // Parse the query string manually
      const queryParams = queryString
        .split('&')
        .map(param => param.split('='))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const { course, holeId, holeNo, par,courseName } = queryParams;
      if (course && holeId && holeNo && par) {
        setScannedData({
          course,
          holeId,
          holeNo,
          par,
        });
        let HoleNumberParNumber = `Hole #${holeNo} Par-${par}`;
        const data = await handleCheckRegistration(holeId); 
     if(data?.display && data?.error){
      navigation.navigate('CourceCart', { HoleID: holeId, CourseName:courseName, HoleNumberParNumber: HoleNumberParNumber })
  
     }else{
      // {"data": {"clubName": "Saginaw Country Club", "contestTypes":
        
      //   ["CLOSEST_TO_THE_PIN"], "courseName": "Saginaw Course", "firstName": "Geeta",
      //    "holeId": 1, "holeNumber": 17, "imageBase64": null, "imageUrl": null, "lastName": "Negi",
         
      //    "par": 4, "playerCartIds": [48], "teeId": 3, "teeName": "Gold Tees", "teePosition":
      //     "South", "yardage": 12000}, "description": null, "display": true, "error": false}
    navigation.navigate('EnterQue',{QueData:data})
     }
     } else if (course && courseName) {
        navigation.navigate('CourceDetails', { CourseId:course, CourseName:courseName})
      } else {
        throw new Error('QR is not valid');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid QR Code format.');
      setScanned(false); // Allow rescan if an error occurs
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={geeta}>

        <Text>jhb</Text>
      </TouchableOpacity> */}
      <RNCamera
        style={StyleSheet.absoluteFillObject}
        onBarCodeRead={scanned ? undefined : handleQRCodeRead} // Disable scanning after the first scan
        captureAudio={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default QRCodeScanner;
