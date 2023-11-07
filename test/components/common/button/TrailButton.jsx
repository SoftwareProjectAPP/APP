import { Text, TouchableOpacity, View } from "react-native";

import styles_trail from "./trailButton.style";

const TrailButton = ({ text }) => {
  return (
    <View style={styles_trail.container}>
      <TouchableOpacity
        style={styles_trail.applyBtn}
        onPress={() => null}
      >
        <Text style={styles_trail.applyBtnText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrailButton;