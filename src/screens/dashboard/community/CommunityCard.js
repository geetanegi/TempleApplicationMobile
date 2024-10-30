import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors, images, NAVIGATION} from '../../../global/theme';

const CommunityCard = ({item, navigation}) => {

  const openProfile = async () => {
    const data = {
      item: 'ViewProfile',
      UserId: item?.id,
    };
  //  navigation.navigate(NAVIGATION.TO_EDIT_PROFILE, {item: data ,backIconVisibility :true});
  };
  return (
    <TouchableOpacity onPress={() => openProfile()}>
      <View style={styles.itemContainer}>
        {!item?.userProfile?.imageBase64 ? (
          <Image source={images.user} style={styles.avatar} />
        ) : (
          <Image
            source={{
              uri: `data:image/jpg;base64,${item?.userProfile?.imageBase64}`,
            }}
            style={styles.avatar}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>
            {item?.firstName} {item?.lastName}
          </Text>
          <Text style={styles.location}>{item?.username}</Text>
        </View>
        {/* <View style={styles.followersContainer}>
          <FontAwesome name="user" size={16} color={colors.LIST_TEXT_COLOR} />
          <Text style={styles.followers}>90</Text>
           <Text style={styles.followers}>{item.followers}</Text> 
        </View> */}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent background for list items
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    //elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    // fontWeight: 'bold',
    fontSize: 16,
    color:'#1D1A0C'
  },
  location: {
    color: '#A9A9A9',
  },
  followersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followers: {
    marginLeft: 5,
    color: '#A9A9A9',
  },
});
export default CommunityCard;
