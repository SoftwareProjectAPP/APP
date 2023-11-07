
import { Image, TouchableOpacity } from 'react-native';

import styles from './screenheader.style';



const TrailListBtn = ({}) => {
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={() => console.log("hello")}>
            <Image
            source={require('../../../assets/icons/list.png')}
            resizeMode="cover"
            style={{width: 40, height: 40}}
            />
        </TouchableOpacity>
    );
};

export default TrailListBtn;