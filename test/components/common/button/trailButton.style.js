import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles_trail = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.small,
    //backgroundColor: COLORS.lightGreen,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  applyBtn: {
    height: 45,
    paddingBottom: 5,
    paddingTop: 5,
    flex: 1,
    backgroundColor: COLORS.mediumGreen,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SIZES.medium,
    borderRadius: SIZES.medium,
  },
  applyBtnText: {
    fontSize: SIZES.large,
    color: COLORS.white
  },
});

export default styles_trail;
