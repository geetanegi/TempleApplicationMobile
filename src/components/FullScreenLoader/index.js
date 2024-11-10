import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Text } from 'react-native';


const FullScreenLoader = ({ visible, text = 'Loading...' }) => {
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={visible} size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "#000000",
    // opacity: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loaderContainer: {
    padding: 20,
    backgroundColor: '#000000',
    //  opacity: 0.6,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },
});

export default FullScreenLoader;
