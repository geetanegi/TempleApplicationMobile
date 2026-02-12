import {StyleSheet, Text, View, Pressable, Linking} from 'react-native';
import React from 'react';
import styles from '../../global/styles';
import { environment } from '../../utils/constant';

const PrivacyPolicy = () => {
  const openPrivacyPolicy = () => {
    if (environment.Privacy_policy) {
      Linking.openURL(environment.Privacy_policy);
    }
  };
  return (
    <Pressable onPress={() => openPrivacyPolicy()}>
      <Text style={styles.privacyTxt}>© 2025 Jainsansaar. All rights reserved. Terms & Conditions and Privacy Policy</Text>
    </Pressable>
  );
};

export default PrivacyPolicy;

