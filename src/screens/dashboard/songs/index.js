import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View,
  Alert,
} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/Header/newHeader';
import st from '../../../global/styles';
import InputText from '../../../components/InputText';
import {APP_TEXT, colors} from '../../../global/theme';
import CategoryButton from '../../../components/categoryButton';
import {musicList, songNavs} from '../../../dummy';
import MusicCard from '../../../components/musicCard';

const SongsPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

      <CustomHeader title={'Song'} /> */}
      <FlatList
        style={[st.pd_H20]}
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
            <FlatList
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
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default SongsPage;

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
