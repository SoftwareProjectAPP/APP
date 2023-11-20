import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TrailButton } from '../components';
import styles_trail from "../components/common/button/trailButton.style";
import styles_footer from "../components/common/footer/footer.style";
import { SIZES, icons } from '../constants';
import { get_all_trails } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';
import { BASE_URL, VARIABLES } from '../constants/config';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Overlay from 'react-native-modal-overlay';

export default function TrailListpage({navigation}){
    // error message state variables
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [error_message_title, setErrorMessageTitle] = React.useState('');

    // error message function
    const show_error = (error_message) => {
        setErrorMessageTitle('Error');
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
    }
    // state variables used to store trails
    const [trail_list, setTrailList] = React.useState([]);

    const speak = () => {
        const voice = 'First trail: Fern Trail, Second trail: Northwest Trail, Third trail: Lone Star Trail, fourth trail: Lake Loop Trail, and fifth trail: Sandy Trail. Then at the bottom of the page to the left button is the achievements and right button is login page.';
        speak_data(voice);
    }

    // check if user is logged in
    const check_logged_in = async () => {
        try{
            // make API get request
            const res = await axios.get(BASE_URL + '/api/achievements/getall',{
                headers: {
                    'Authorization': 'bearer ' + VARIABLES.user_token
                }
            });
            // get data
            const data = res['data'];
            if(data.success === true)
            {
                navigation.navigate('AchievementScreen');
            }else{
                // show custom error message
                show_error(data.error);
            }
        }catch(error){
            // override error message
            error.message = "Not logged in";
            // error means that user cant log in (token is expired)
            show_error(error.message);
        }
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
                // it did so store data in list
                setTrailList(t.data);
                setScreenLoading(false);
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
            <Overlay
                visible={modalVisible}
                onClose={()=>{setModalVisible(false);}}
                containerStyle={{backgroundColor: 'rgba(90, 90, 90, 0.5)'}}
                childrenWrapperStyle={{backgroundColor: '#fff'}}
                closeOnTouchOutside
            >
                <Text>{error_message_title}</Text>
                <Text>{error_messaged}</Text>
            </Overlay>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                <Spinner
                    visible={isScreenLoading}
                    textContent={'Loading...'}
                    textStyle={{color:'#FFF'}}
                />
            </View>
            <View/>
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
                    onPress={() => check_logged_in()}>
                        <Image
                            source={icons.trophyIcon}
                            resizeMode='contain'
                            style={styles_footer.trophyBtnImage}
                        />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles_footer.ApplyBtn}
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                <Text style={styles_footer.ApplyBtnText}>Login</Text> 
                </TouchableOpacity> 
            </View>
        </View>
    )
}
