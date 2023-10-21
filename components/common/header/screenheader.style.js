import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
    btnContainer: {
        width: 50,
        hight: 50,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.large / 1.25,
        justifyContent: "center",
        alignItems: "center",
    },
    btnImg: (dimension) => ({
        width: dimension,
        hight: dimension,
        borderRadius: SIZES.large / 1.25,
    }),
});

export default styles;