import {
    Text,
    View,
} from "react-native";

import { useRouter } from "expo-router";

import styles from './welcome.style';

const Welcome = () => {
    const router = useRouter();

    return (
        <View>
            <View style={styles.container}>
                <Text style={ styles.welcomeMessage}>Welcome to TrailBlazer your Hiking Companion!</Text>
            </View>
        </View>
    )
}

export default Welcome;
