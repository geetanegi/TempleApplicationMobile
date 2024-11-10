import {
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import st from '../../../global/styles';
import { APP_TEXT, colors } from '../../../global/theme';

const CourceList = ({courceData, onPressList}) => {
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => onPressList(item)}
      activeOpacity={0.9}
      style={st.imageContainer}>
      <Image
         source={{
          uri: `data:image/jpg;base64,${item?.imageBase64}`,
        }}
        resizeMode="stretch"
        style={st.imageGolf}
      />
  <View style={st.metricBox}>
    <Text style={st.clubTitle}>{item?.courseName}</Text>
    <AntDesign name={APP_TEXT.RIGHT} size={20} color={colors.black} />
    </View>
    </TouchableOpacity>
  );
  return (
    <View style={st.HoleListContatiner}>
      <FlatList
        horizontal={false}
        data={courceData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{backgroundColor: colors.TRANSPARENT}}
      />
    </View>
  );
};
export default CourceList;
