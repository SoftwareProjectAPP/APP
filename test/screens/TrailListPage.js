import * as Speech from 'expo-speech';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { TrailButton } from '../components';
import { SIZES } from '../constants';

import styles_trail from "../components/common/button/trailButton.style";
import styles_footer from "../components/common/footer/footer.style";
import { icons } from "../constants";

import { get_all_trails } from '../constants/database';


export default function TrailListpage({navigation}){
    const [trail_list, setTrailList] = React.useState([]);

    const speak = () => {
        const Voice = 'first trail: Lone Star Trail, Second trail: kellys Pond trail, third trail: Lake loop trail, forth trail: Sandy trail, Fifth Trail:Fern trail and Then at the bottom of the page to the left button is the achievements and right button is login page.';
        Speech.speak(Voice);
    }

    React.useEffect(()=>{
        get_trails();
    }, []);

    const get_trails = async () => {
        get_all_trails((d)=>{
            console.log("d=");
            console.log(d);
            if(d["success"] === true)
            {
                console.log("called");
                setTrailList(d['data']);
            }
            else{
                throw new Error(d["error"]);
            }
        });
    }

    return(
        <View>
            <View
            />
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

                    <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                        <View style={styles_trail.container}>
                            <TouchableOpacity
                                style={styles_trail.applyBtn}
                                onPress={() => navigation.navigate('TrailOverviewTemplate')}
                            >
                                <Text style={styles_trail.applyBtnText}>Lone Star Trail</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    
                    <FlatList
                        data={trail_list}
                        keyExtractor={({id})=>id}
                        renderItem={({item})=>(
                            <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                                <TrailButton text={item.name} trail_id={item.id} navigation={navigation}/>
                            </View>
                        )}
                    />

            <View style={styles_footer.container}>
                <TouchableOpacity
                    style={styles_footer.achievementBtn}
                    onPress={() => navigation.navigate('AchievementScreen')}>
                        <Image
                            source={icons.trophyIcon} //Change to the trophy
                            resizeMode='contain'
                            style={styles_footer.likeBtnImage}
                        />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles_footer.applyBtn}
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                <Text style={styles_footer.applyBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
