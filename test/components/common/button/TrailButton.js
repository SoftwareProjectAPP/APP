import { Text, TouchableOpacity, View } from "react-native";
import { VARIABLES } from "../../../constants/config";
import { update_config } from "../../../constants/database";
import styles_trail from "./trailButton.style";

const TrailButton = ({ text, trail_id, navigation }) => {
  return (
    <View style={styles_trail.container}>
      <TouchableOpacity
        style={styles_trail.applyBtn}
        onPress={async () => {
          const t = await update_config('trail_id',trail_id);
          if(t.success){
            VARIABLES.trail_id = trail_id;
            navigation.navigate('TrailOverviewTemplate');
          }else{
            console.log("Error: " + t.error);
            throw new Error(t.error);
          }
        }}
      >
        <Text style={styles_trail.applyBtnText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrailButton;