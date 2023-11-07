import axios from 'axios';
import * as Speech from 'expo-speech';
import * as React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles_trail from "../components/common/button/trailButton.style";
import styles_Welcome from '../components/home/welcome/welcome.style';
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';

export default function HomeScreen({navigation}){
    const speak = () => {
        const Voice = 'Hello, Welcome to TrailBlazer your Hiking Companion!';
        Speech.speak(Voice);
    }

    const get_data = async () => {
        const res = await axios.get(BASE_URL + "/api/getinfo/" + VARIABLES.DB_VERSION);

        const data = res["data"];

        if(data["success"] === true){
            if(data["current_version"] == true){
                console.log("Version match");
            }else{
                // add to database
                const new_version = data["new_version"];
                const trail_list = data["trail_data"];
                console.log("new_version = " + new_version);
                // update database version
                VARIABLES.DB_VERSION = new_version;
                console.log("trail_list =");
                console.log(trail_list);
                trail_list.forEach(trail => {
                    const name = trail["name"];
                    const image_url = trail["image_URL"];
                    const audio_url = trail["audio_URL"];
                    const description = trail["description"];
                    const mileage = trail["mileage"];
                    const rating = trail["rating"];
                    const is_w_a = trail["is_wheelchair_accessible"];
                    const trail_check_list = trail["trailchecklists"];
                    trail_check_list.forEach(check => {
                        const item = check["item"];
                    });
                });
            }
        }else{
            // report error with modal or popup
            console.log(res["error"]);
        }
    }

    React.useEffect(()=>{
        get_data();
    }, []);

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator= {false}>
                <View>
                    <View>
                        <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                            <View style={styles_trail.container}>
                                <TouchableOpacity onPress={speak}>
                                    <Image
                                        source={require('../assets/icons/speaker.png')}
                                        resizeMode="cover"
                                        style={{width: 60, height: 60}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles_Welcome.welcomeMessage}>
                            Welcome to TrailBlazer your Hiking Companion!
                        </Text>
                        <Image
                            source ={require('../assets/images/Map.jpg')}
                            resizeMode='cover'
                            style={{width: 400, height: 300, }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
