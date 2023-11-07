import { Image, TouchableOpacity } from "react-native";



import styles from "./screenheader.style";

const ScreenHeaderBtn = ({}) => {
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={()=>{console.log("hello")}}>
            <Image
            source={require('../../../assets/icons/setting.png')}
            resizeMode="cover"
            style={{width: 40, height: 40}}
            />
        </TouchableOpacity>
    );
};

export default ScreenHeaderBtn;