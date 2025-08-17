import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../../assets/theme";

const SwipeUpFooter = ({ text, link }: { text: string; link: string }) => (
  <View style={styles.footer}>
    <Icon name="chevron-circle-up" size={26} color={colors.background} />
    <Pressable style={styles.textContainer}>
      <Text style={[styles.footerText,styles.fontlight]}>{text} </Text>
      <Text style={styles.footerText}>{link}</Text>
    </Pressable>
  </View>
);

export default SwipeUpFooter;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Rubik-Medium',
  },
  fontlight:{
    fontFamily:"Rubik-Regular"
  },
  textContainer: {
    flexDirection: 'row', marginTop: 6
  }
})