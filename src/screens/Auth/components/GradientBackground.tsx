import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../../assets/theme";
import { StyleSheet } from "react-native";

const GradientBackground = ({ children }: { children: React.ReactNode }) => (
    <LinearGradient
        style={styles.container}
        colors={[colors.linearGradient[0], colors.linearGradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}

    >
        {children}
    </LinearGradient>
);

export default GradientBackground;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        position: 'relative',
    },
});
