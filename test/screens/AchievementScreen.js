import axios from 'axios';
import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AchievementComponent from '../components/AchievementComponent';
import styles_trail from "../components/common/button/trailButton.style";
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';
import { speak_data } from '../constants/text_to_speech';
import Spinner from 'react-native-loading-spinner-overlay';
import Overlay from 'react-native-modal-overlay';

const AchievementScreen = () => {
    // state variables for error modal and loading
    const [achievement_list, setAchievementList] = React.useState([]);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_message_title,setErrorMessageTitle] = React.useState('');

    const show_error = (error_message) => {
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
        setErrorMessageTitle('Error');
    }

    // get all achievements from server
    const get_all = async () =>{
        try{
            // make GET request with authorization header
            const res = await axios.get(BASE_URL + '/api/achievements/getall',{
                headers: {
                    'Authorization': 'bearer ' + VARIABLES.user_token
                }
            });
            // get response from server
            const data = res["data"];
            console.log("data = ");
            console.log(data);
            // check if response worked
            if(data["success"] === true){
                // get achievements
                var achievements = data["user_achievements"][0];
                console.log("achievements = ");
                console.log(achievements);
                // encode achievements into achievement list
                var test = []
                for(const key in achievements){
                    if(achievements.hasOwnProperty(key)){
                        test.push({
                            'title': key,
                            'is_enabled': achievements[key]
                        });
                    }
                }
                setAchievementList(test);
            }else{
                // show popup error message
                show_error(data['error']);
            }
        }catch(error){
            show_error(error);
        }
    }

    // call function when screen is loaded
    React.useEffect(()=>{
        get_all();
    }, []);

    // add achievements
    const add = async (achievement_name) =>{
        try{
            console.log("add called");
            console.log("achievement_name = ");
            console.log(achievement_name);
            // encode data
            const user_data = {
                achievement_name: achievement_name
            };
            console.log("user_token = ");
            console.log(VARIABLES.user_token);
            // make POST request with authorization header
            const res = await axios.post(BASE_URL + "/api/achievements/add",user_data,{
                headers: {
                    'Authorization': 'bearer ' + VARIABLES.user_token
                }
            });
            console.log("res = ");
            console.log(res);
            // get response from server
            const data = res["data"];

            console.log("data = ");
            console.log(data);

            // check if response worked
            if(data["success"] === true){
                // show popup
                console.log("add successful");
                return true;
                // change achievement to "true"
            }else{
                // show popup
                show_error(data['error']);
                return false;
            }
        }catch(error){
            show_error(error);
            return false;
        }
    }

    // text to speech
    const speak = () => {
        const voice = 'Hello, This is the achievements Screen please login before using this screen. If login please mark off any trails you have completed.';
        speak_data(voice);
    }
    //This is the style for the pop ups and loading sign
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

    return (
        <View>
            <Overlay
                visible={modalVisible}
                onClose={()=>{setModalVisible(false);}}
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
                data={achievement_list}
                renderItem={({item}) => <AchievementComponent achievement_name={item.title} is_enabled={item.is_enabled} add_achievement_parent={add}/>}
            />
        </View>
    );
};

export default AchievementScreen;