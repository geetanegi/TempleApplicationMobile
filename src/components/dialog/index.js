import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Dialog from 'react-native-dialog';
import st from '../../global/styles';

const DialogComponent = ({visible, onCancel, children}) => {
  return (
    <Dialog.Container
      headerStyle={styles.header}
      contentStyle={styles.header}
      footerStyle={styles.header}
      visible={visible}
      onBackdropPress={onCancel}>
      <View style={[st.pd10]}>{children}</View>
    </Dialog.Container>
  );
};

export default DialogComponent;

const styles = StyleSheet.create({
  header: {
    padding: 0,
    margin: 0,
    borderRadius: 16,
  },
});
