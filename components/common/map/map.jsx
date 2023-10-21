import { Image, View } from 'react-native';


import styles from './map.style';

const DispalyMap = () => {

    return(
        <View style={styles.container}>
            <Image
            style={styles} source={require('../../../assets/images/Map.jpg')}
            />
        </View>
    )
};

export default DispalyMap;
