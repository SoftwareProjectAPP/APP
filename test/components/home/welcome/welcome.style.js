import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles_Welcome= StyleSheet.create({
    container: {
        width: "100%",
    },
    welcomeMessage:{
        fontSize: SIZES.xLarge,
        color: COLORS.black,
        textAlign:"center",
        fontWeight: 'bold',
    },
    pictureTitle:{
        fontSize: SIZES.medium,
        color: COLORS.black,
        textAlign:"center",
        fontWeight: 'bold',
    }
});

export default styles_Welcome;