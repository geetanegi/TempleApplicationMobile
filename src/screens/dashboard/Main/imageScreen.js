import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/Header/newHeader';
import {imageList} from '../../../dummy';
import VideoCard from '../../../components/videocard';
import InputText from '../../../components/InputText';
import {colors, APP_TEXT} from '../../../global/theme';
import st from '../../../global/styles';
import ImageCard from '../../../components/imageCard';
const {width} = Dimensions.get('screen');
const ImageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

      <CustomHeader title={'Videos'} /> */}
      <FlatList
        style={[st.flex, st.gap20, st.pd_H10]}
        data={imageList}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={[st.justify_S]}
        renderItem={({item}) => (
          <View>
            <ImageCard item={item} />
          </View>
        )}
        ListHeaderComponent={
          <View style={[st.mt_B10, st.wdh100, st.pd_H20]}>
            <InputText
              inputsty={{width: '100%'}} // full width
              placeholder={APP_TEXT.SEARCH}
              iconName={'search'}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tab: {
    backgroundColor: colors.orange,
    padding: 10,
    borderRadius: 100,
    paddingHorizontal: 18,
  },
  inpStyle: {
    width: '100%',
  },
});
