import axios from 'axios';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import styles_trail from "../components/common/button/trailButton.style";
import PopupErrorMessage from '../components/popupErrorMessage';
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';
import { update_config } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';

const SettingPage = ({navigation}) => {
    // error message state variables
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isScreenLoading, setScreenLoading] = React.useState(false);

    // text to speech feature
    const speak = () => {
        const voice = 'In the setting Screen, there is a logout button';
        speak_data(voice);
    }

    // show error message
    const show_error = (error_message) => {
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
        throw new Error(error_message);
    }

    // send data to server
    const send_data = async () =>{
        try{
            console.log("token = ");
            console.log(VARIABLES.user_token);
            // send api request to logout and include header
            const res = await axios.get(BASE_URL + '/api/authenticate/logout',{
                headers: {
                    'Authorization': 'bearer ' + VARIABLES.user_token
                }
            });
            // get response from server
            const data = res['data'];
            console.log("data = " );
            console.log(data);
            // check if request was successful
            if(data['success'] === true)
            {
                // update user_token in db
                const t = await update_config('user_token','');
                // check if it worked
                if(t.success){
                    // reset user_token in file
                    VARIABLES.user_token = '';
                }else{
                    show_error(t.error);
                }
            }else{
                show_error(data['error']);
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
    
    return (
        <View>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                {isScreenLoading && <ActivityIndicator />}
                <PopupErrorMessage
                    error_message={error_messaged}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
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
            <CustomButton label={"Logout"} onPress={() => {send_data()}} />
        </View>
    );
};

export default SettingPage;