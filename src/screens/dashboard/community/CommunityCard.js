import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {APP_TEXT, images, NAVIGATION} from '../../../global/theme';
import st from '../../../global/styles';
const CommunityCard = ({item, navigation}) => {

  const openProfile = async () => {
    const data = {
      item: APP_TEXT.VIEW_PROFILE,
      UserId: item?.id,
    };
    navigation.navigate(NAVIGATION.TO_EDIT_PROFILE, {item: data ,backIconVisibility :true});
  };
  return (
    <TouchableOpacity onPress={() => openProfile()}>
      <View style={st.communityitemContainer}>
        {!item?.userProfile?.imageBase64 ? (
          <Image source={images.user} style={st.communityavatar} />
        ) : (
          <Image
            source={{
              uri: `data:image/jpg;base64,${item?.userProfile?.imageBase64}`,
            }}
            style={st.communityavatar}
          />
        )}
        <View style={st.communitytextContainer}>
          <Text style={st.communityname}>
            {item?.firstName} {item?.lastName}
          </Text>
          <Text style={st.communitylocation}>{item?.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default CommunityCard;
