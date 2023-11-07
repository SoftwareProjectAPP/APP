import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles_footer = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: -320,
    left: 0,
    right: 0,
    padding: SIZES.small,
    backgroundColor: "#FFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  achievementBtn: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: "#00894C",
    backgroundColor: "#00894C",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  likeBtnImage: {
    width: "60%",
    height: "60%",
    tintColor: COLORS.white,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#00894C",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SIZES.medium,
    borderRadius: SIZES.medium,
  },
  applyBtnText: {
    fontSize: SIZES.xLarge,
    color: COLORS.white,
  },
});

export default styles_footer;