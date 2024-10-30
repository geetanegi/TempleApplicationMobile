// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

// const QRScannerScreen = () => {
//   const devices = useCameraDevices(); // Fetch available camera devices
//   const device = devices.back; // Select the back camera
//   const [hasPermission, setHasPermission] = useState(false); // State for camera permissions

//   // Request camera permission when the component mounts
//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === 'authorized'); // Set permission state
//     };

//     requestCameraPermission();
//   }, []);

//   // Hook to scan barcodes including QR codes
//   const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

//   // Handle scanned barcodes
//   useEffect(() => {
//     if (barcodes.length > 0) {
//       const barcode = barcodes[0];
//       Alert.alert('Scanned QR Code', barcode.displayValue); // Display the scanned data
//     }
//   }, [barcodes]);

//   if (device == null || !hasPermission) {
//     return <Text>Loading camera...</Text>; // Display loading text if camera or permission is not available
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill} // Make the camera fill the screen
//         device={device}
//         isActive={true} // Activate the camera
//         frameProcessor={frameProcessor} // Pass the frame processor to detect barcodes
//         frameProcessorFps={5} // Frame processing frequency, adjust based on performance needs
//       />
//       <View style={styles.overlay}>
//         <Text style={styles.overlayText}>Align the QR code within the frame</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 50,
//     width: '100%',
//     alignItems: 'center',
//   },
//   overlayText: {
//     fontSize: 18,
//     color: '#fff',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default QRScannerScreen;
