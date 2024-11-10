// import React, { useState } from 'react';
// import { View, Text, Alert, StyleSheet } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const QRCodeScanner  = ({navigation}) => {
//   const [scanned, setScanned] = useState(false); // Track whether a QR code has been scanned
//   const [scannedData, setScannedData] = useState(null); // Store extracted data

//   const handleQRCodeRead = (e) => {
//     if (scanned) return; // If already scanned, do nothing

//     setScanned(true); // Mark as scanned to prevent further scanning
//     const scannedUrl = e.data;

//     if (!scannedUrl || typeof scannedUrl !== 'string') {
//       Alert.alert('Error', 'Scanned data is not a valid URL');
//       setScanned(false); // Allow rescan if an error occurs
//       return;
//     }

//     try {
//       // Check if the URL contains a query string
//       if (!scannedUrl.includes('?')) {
//         throw new Error('No query string found in the scanned URL');
//       }

//       const queryString = scannedUrl.split('?')[1];
//       if (!queryString) {
//         throw new Error('No valid query parameters found');
//       }

//       // Parse the query string manually
//       const queryParams = queryString
//         .split('&')
//         .map(param => param.split('='))
//         .reduce((acc, [key, value]) => {
//           acc[key] = value;
//           return acc;
//         }, {});

//       const { course, holeId, holeNo, par } = queryParams;

//       if (!course || !holeId || !holeNo || !par) {
//         throw new Error('Missing parameters in the QR code');
//       }

//       setScannedData({
//         course,
//         holeId,
//         holeNo,
//         par,
//       });

   
//       let HoleNumberParNumber = `Hole #${holeNo} Par-${par}`;
//       navigation.navigate('CourceCart', { HoleID:holeId ,CourseName:"courseName" ,HoleNumberParNumber:HoleNumberParNumber})


//       Alert.alert('Scanned QR Code', `Course: ${course}, Hole No: ${holeNo}, Par: ${par}`);
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Invalid QR Code format.');
//       setScanned(false); // Allow rescan if an error occurs
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <RNCamera
//         style={StyleSheet.absoluteFillObject}
//         onBarCodeRead={scanned ? undefined : handleQRCodeRead} // Disable scanning after the first scan
//         captureAudio={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   infoContainer: {
//     position: 'absolute',
//     bottom: 50,
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//   },
//   infoText: {
//     fontSize: 18,
//     marginVertical: 5,
//   },
// });

// export default QRCodeScanner;
