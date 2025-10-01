import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';
import AuthHeader from '../../../components/Auth_Header';
import Footer from '../../../components/footer';
import st from '../../../global/styles';
import {useNavigation} from '@react-navigation/native';

const ViewPdf = ({navigation, route}) => {
  const navigate = useNavigation();
  const {pdfUrl} = route.params || '';
  const url =
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  const source = {
    uri: pdfUrl || url,
    cache: true,
  };

  return (
    <View style={st.flex}>
      {/* <AuthHeader
        title={'PDF Viewer'}
        onBack={() => navigate.goBack()}
        auth={true}
      /> */}
      <Pdf
        source={source}
        trustAllCerts={Platform.OS === 'ios'}
        onLoadComplete={(pages, path) => {
          console.log('Loaded', pages);
        }}
        onError={e => {
          console.log('PDF error', e);
        }}
        onPageChanged={(page, numberOfPages) => {}}
        //   onError={error => {
        //     // alert(error);
        //   }}
        onPressLink={uri => {}}
        style={styles.pdf}
      />
      <Footer />
    </View>
  );
};

export default ViewPdf;

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
