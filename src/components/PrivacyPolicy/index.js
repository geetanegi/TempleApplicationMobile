import {StyleSheet, Text, View, Pressable, Linking} from 'react-native';
import React from 'react';
import styles from '../../global/styles';
import { environment } from '../../utils/constant';

const PrivacyPolicy = () => {
  const openPrivacyPolicy = () => {
    const url = (environment.Privacy_policy || '').trim();
    if (url && !url.includes('your-domain.com')) {
      Linking.openURL(url);
    }
  };
  return (
    <Pressable onPress={() => openPrivacyPolicy()}>
      <Text style={styles.privacyTxt}>
        © 2025 Jainsansaar. All rights reserved. Terms & Conditions and Privacy Policy
      </Text>
    </Pressable>
  );
};

export default PrivacyPolicy;

