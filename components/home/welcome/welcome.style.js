import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    welcomeMessage:{
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.secondary,
        textAlign:"center",
    }
});

export default styles;