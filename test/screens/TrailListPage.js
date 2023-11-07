import * as Speech from 'expo-speech';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TrailButton } from '../components';
import { SIZES } from '../constants';

import styles_trail from "../components/common/button/trailButton.style";
import styles_footer from "../components/common/footer/footer.style";
import { icons } from "../constants";


export default function TrailListpage({navigation}){
    const speak = () => {
        const Voice = 'first trail: Lone Star Trail, Second trail: kellys Pond trail, third trail: Lake loop trail, forth trail: Sandy trail, Fifth Trail:Fern trail and Then at the bottom of the page to the left button is the achievements and right button is login page.';
        Speech.speak(Voice);
    }
    return(
        <View>
            <View
            />
                <ScrollView showsVerticalScrollIndicator={false}>

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
                                onPress={() => navigation.navigate('LoneStarTrailScreen')}
                            >
                                <Text style={styles_trail.applyBtnText}>Lone Star Trail</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                        <TrailButton text={'Northwest Trail'}/>
                    </View>

                    <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                        <TrailButton text={'Lake Loop Trail'}/>
                    </View>

                    <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                        <TrailButton text={'Sandy Trail'}/>
                    </View>

                    <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                        <TrailButton text={'Fern Trail'}/>
                    </View>


                </ScrollView>
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
