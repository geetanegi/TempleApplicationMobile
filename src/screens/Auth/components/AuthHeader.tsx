import { Text, View } from "react-native";
import { StyleSheet } from 'react-native';
import { colors } from "../../../assets/theme";

const AuthHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.header}>
            {title}
        </Text>
        {subtitle && (
            <Text style={styles.subtitle}>
                {subtitle}
            </Text>
        )}
    </View>
);

export default AuthHeader;

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 24
    },
    header: {
        fontSize: 24,
        fontFamily: 'Rubik-Bold',
        color: colors.title,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        color: colors.text,
        marginTop: 2
    },

})