import { Text, TextInput, View } from "react-native";
import { StyleSheet } from 'react-native';
import { colors } from "../../../assets/theme";

const AuthInput = ({ label, placeholder, secure, keyboardType = 'default' }:
    { label: string; placeholder?: string; secure?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric' }) => (
    <View style={styles.inputView}>
        <Text style={styles.label}>
            {label}
        </Text>
        <TextInput
            placeholder={placeholder}
            secureTextEntry={secure}
            keyboardType={keyboardType}
            autoCapitalize="none"
            style={styles.inputBox}
        />
    </View>
);

const styles = StyleSheet.create({
    inputView: {
        marginBottom: 16
    },
    lightText: {
        fontFamily: 'Rubik-Regular',
        color: colors.text,
    },
    label: {
        fontSize: 12,
        textTransform: 'uppercase',
        opacity: 0.7,
        fontFamily: 'Rubik-Regular'
    },
    inputBox: {
        height: 60,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 1,
        fontFamily: 'Rubik-Regular',
    }
})
export default AuthInput;