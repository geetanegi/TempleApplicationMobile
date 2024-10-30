import {View, Text, TextInput, StyleSheet, FlatList, Image} from 'react-native';
import React, {useState, useRef} from 'react';
import SocialImg from '../socialImage';
const SocialLogin = ({data,onSocialLogin}) => {

  const renderItem = ({item}) => (
    <View>
      <SocialImg
        onPress={() => onSocialLogin((VAL = item.button))}
        imageSource={item.name}
      />
    </View>
  );
  
  return (
    <FlatList
      contentContainerStyle={styles.iconList}
      data={data}
      horizontal={true}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  iconList: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default SocialLogin;
