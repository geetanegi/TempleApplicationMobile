import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import st from '../../../global/styles';

const {width, height} = Dimensions.get('window');

const AartiScreen = () => {
  const content = `
वृषभ अजित सम्भव अभिनंदन सुमति पद्म सुपार्श्व जिनराय,

चन्द्र पुष्प शीतल श्रेयांसु नमि पथ पण्डित सुरराय.

विमल अनंत धर्म जस उज्जवल शांति कुंथ अर मल्लि मनाय,
मुनि सुव्रत नमि नेमि पार्श्व प्रभु वर्धमान पद पूज बढ़ाय.

ॐ ह्रीं श्री वृषभ-भादि वीरां चतुर-विंशति जिन समूहो अत्र अवतर अवतर संवौषट्
ॐ ह्रीं श्री वृषभ-भादि वीरां चतुर-विंशति जिन समूहो अत्र तिष्ठ तिष्ठ ठः ठः
ॐ ह्रीं श्री वृषभ-भादि वीरां चतुर-विंशति जिन समूहो अत्र मम सन्निहितो भव भव वषट्

... (बाकी टेक्स्ट यहाँ)
`;

  return (
    <View style={st.flex}>
      <ImageBackground
        source={require('../../../images/pdfimg.png')}
        style={styles.bg}
        resizeMode="stretch"
      >
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>JainSansaar</Text>

            <Text style={styles.text}>{content.trim()}</Text>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default AartiScreen;

const styles = StyleSheet.create({
  bg: {

    padding:90,
    height,
  },
  safe: {
    flex: 1,
    paddingBottom: 24,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 18 : 10,
    paddingHorizontal: 26,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 18,
    color: '#1b1b1b',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 26,
    color: '#1b1b1b',
    paddingBottom: 40,
  },
});
