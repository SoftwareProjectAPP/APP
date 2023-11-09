import { Text, TouchableOpacity, View } from "react-native";
import { VARIABLES } from "../../../constants/config";
import styles_trail from "./trailButton.style";

const TrailButton = ({ text, trail_id, navigation }) => {
  return (
    <View style={styles_trail.container}>
      <TouchableOpacity
        style={styles_trail.applyBtn}
        onPress={() => {
          VARIABLES.trail_id = trail_id;
          navigation.navigate('TrailOverviewTemplate');
        }}
      >
        <Text style={styles_trail.applyBtnText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrailButton;