import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View,
  Alert,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/Header/newHeader';
import st from '../../../global/styles';
import InputText from '../../../components/InputText';
import {APP_TEXT, colors} from '../../../global/theme';
import CategoryButton from '../../../components/categoryButton';
import {musicList, songNavs} from '../../../dummy';
import MusicCard from '../../../components/musicCard';
import {useRoute} from '@react-navigation/native';

const {width} = Dimensions.get('screen');
const SubCategoryPage = () => {
  const route = useRoute();
  const {title, image} = route.params || {};
  return (
    <ScrollView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

      <CustomHeader title={'Song'} /> */}
      {/* <View
        style={{
          flex: 1 / 3,
          justifyContent: 'center',
          alignItems: 'center',
          height: 500,
        }}>
        <Image
          source={image}
          style={{width: width, resizeMode: 'cover', height: '100%'}}
        />
      </View> */}
      <FlatList
        style={[st.pd_H20, st.flex]}
        data={musicList}
        keyExtractor={item => item.id}
        renderItem={({item}) => <MusicCard item={item} />}
        ListHeaderComponent={
          <View style={[st.mt_B10]}>
            <InputText
              placeholder={APP_TEXT.SEARCH}
              iconName={'search'}
              onFocus={() => Alert.alert('Clicked!')}
            />
            {/* <FlatList
              data={songNavs}
              keyExtractor={item => item.label}
              renderItem={({item}) => (
                <View style={[st.align_C, styles.tab]}>
                  <Text style={[st.tx12, {color: colors.white}]}>
                    {item.label}
                  </Text>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                st.mt_t10,
                st.wdh100,
                st.justify_S,
                st.pv10,
              ]}
            /> */}
          </View>
        }
      />
    </ScrollView>
  );
};

export default SubCategoryPage;

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
});
