import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../../assets/theme";
import Icon from "react-native-vector-icons/FontAwesome";

const AuthButton = ({ label, onPress, icon }: { label: string; onPress: () => void; icon?: string }) => (
    <Pressable
        onPress={onPress}
        style={styles.button}
    >
        <Text style={styles.buttonText}>
            {label}
        </Text>
        {icon && <Icon name={icon} size={18} color="#fff" />}
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.secondary,
        paddingVertical: 18,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginVertical:10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Rubik-Medium',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '100%',
    },
})

export default AuthButton;