import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TrailButton } from '../components';
import styles_trail from "../components/common/button/trailButton.style";
import styles_footer from "../components/common/footer/footer.style";
import PopupErrorMessage from '../components/popupErrorMessage';
import { SIZES, icons } from '../constants';
import { get_all_trails } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';

export default function TrailListpage({navigation}){
    // error message state variables
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    // error message function
    const show_error = (error_message) => {
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
        throw new Error(error_message);
    }
    // state variables used to store trails
    const [trail_list, setTrailList] = React.useState([]);

    const speak = () => {
        const voice = 'First trail: Fern Trail, Second trail: Northwest Trail, Third trail: Lone Star Trail, fourth trail: Lake Loop Trail, and fifth trail: Sandy Trail. Then at the bottom of the page to the left button is the achievements and right button is login page.';
        speak_data(voice);
    }

    // call get trails when page is loaded
    React.useEffect(()=>{
        get_trails();
    }, []);

    // get all trail data
    const get_trails = async () => {
        try{
            setScreenLoading(true);
            // get data from local db
            const t = await get_all_trails();
            // check if worked
            if(t.success){
                setScreenLoading(false);
                // it did so store data in list
                setTrailList(t.data);
            }else{
                // show error message
                show_error(t.error);
            }
        }catch(error){
            show_error(error);
        }
    }

    const styles_Times = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
    });

    return(
        <View>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                {isScreenLoading && <ActivityIndicator />}
                <PopupErrorMessage
                    error_message={error_messaged}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
            </View>
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
