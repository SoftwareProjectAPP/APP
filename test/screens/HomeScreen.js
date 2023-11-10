import axios from 'axios';
import * as Speech from 'expo-speech';
import * as React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles_trail from "../components/common/button/trailButton.style";
import styles_Welcome from '../components/home/welcome/welcome.style';
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';
import { add_trail_checklist_data, add_trail_data, setup, setup_config, update_config } from '../constants/database';
import { download_file_from_url } from '../constants/filestorage';

export default function HomeScreen({navigation}){
    const speak = () => {
        const Voice = 'Hello, Welcome to TrailBlazer your Hiking Companion!';
        Speech.speak(Voice);
    }

    const get_data = async () => {
        console.log("db_version before = ");
        console.log(VARIABLES.DB_VERSION);
        const c = await setup_config();
        console.log("c = ");
        console.log(c);
        if(c.success){
            console.log("Local variables configured");
        }else{
            console.log("Error: " + c.error);
            throw new Error(c.error);
        }
        console.log("db_version = ");
        console.log(VARIABLES.DB_VERSION);

        const res = await axios.get(BASE_URL + "/api/getinfo/" + VARIABLES.DB_VERSION);

        const data = res["data"];

        console.log("axios data = ");
        console.log(data);

        if(data["success"] === true){
            if(data["current_version"] == true){
                console.log("Version match");
            }else{
                console.log("versions dont match");
                const t = await setup();
                console.log("t = ");
                console.log(t);
                if(t.success){
                    console.log("it worked");
                    // add to database
                    const new_version = data["new_version"];
                    const trail_list = data["trail_data"];
                    console.log("new_version = " + new_version);
                    // update database version
                    const tr = await update_config('db_version',new_version);
                    if(tr.success === false)
                    {
                        throw new Error(tr.error);
                    }
                    VARIABLES.DB_VERSION = new_version;
                    console.log("trail_list =");
                    console.log(trail_list);
                    trail_list.forEach(async function(trail){
                        console.log("Called on image: " + trail['image_URL']);
                        var image_url = await download_file_from_url(trail["image_URL"]);
                        console.log("image_url= ");
                        console.log(image_url);
                        if(image_url['success'] === false){
                            console.log("Error: " + image_url['error']);
                            throw new Error(image_url['error']);
                        }
                        image_url = image_url['uri'];
                        console.log("Called on audio: " + trail['audio_URL']);
                        var audio_url = await download_file_from_url(trail["audio_URL"]);
                        if(audio_url['success'] === false){
                            console.log("Error: " + audio_url['error']);
                            throw new Error(audio_url['error']);
                        }
                        audio_url = audio_url['uri'];

                        const t2 = await add_trail_data(
                            {
                                id: trail["id"],
                                name: trail["name"],
                                description: trail["description"],
                                mileage: trail["mileage"],
                                rating: trail["rating"],
                                is_wheelchair_accessible: trail["is_wheelchair_accessible"],
                                image_url: image_url,
                                audio_url: audio_url
                            }
                        );
                        if(t2.success === false){
                            throw new Error(t2.error);
                        }else{
                            const trail_check_list = trail["trailchecklists"];

                            trail_check_list.forEach(async function(check){
                                const t3 = await add_trail_checklist_data(
                                    {
                                        "item": check["item"],
                                        "trailId": trail["id"]
                                    }
                                );
                                if(t3.success === false){
                                    throw new Error(t3.error);
                                }
                            });
                        }
                            
                    });
                }else{
                    console.log("error:" + t.error);
                    throw new Error(t.error);
                }
            }
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
