import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'lucide-react-native';

const AartiScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6C8" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View
          style={[
            styles.frame,
            {
              paddingTop: 16,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}>
          <ImageBackground
            source={require('../../../images/pdfimg.png')}
            style={styles.bg}
            resizeMode="stretch">
            <Pressable
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <ChevronLeft size={28} color="#fff" strokeWidth={2.5} />
            </Pressable>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <Text style={styles.title}>JainSansaar</Text>
              <Text style={styles.text}>{content.trim()}</Text>
            </ScrollView>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AartiScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5E6C8',
  },
  safe: {
    flex: 1,
  },
  frame: {
    flex: 1,
    paddingHorizontal: 10,
  },
  bg: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D48A4A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 72,
    paddingBottom: 28,
    paddingHorizontal: 26,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
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
  },
});
