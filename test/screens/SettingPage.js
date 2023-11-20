import axios from 'axios';
import React from 'react';
import { Image, Text,StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import styles_trail from "../components/common/button/trailButton.style";
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';
import { update_config } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';
import Overlay from 'react-native-modal-overlay';
import Spinner from 'react-native-loading-spinner-overlay';

const SettingPage = ({navigation}) => {
    // error message state variables
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_message_title, setErrorMessageTitle] = React.useState('');

    // text to speech feature
    const speak = () => {
        const voice = 'In the setting Screen, there is a logout button';
        speak_data(voice);
    }
    // show error message
    const show_modal = (body,title) => {
        setErrorMessageTitle(title);
        // hide loading icon
        setScreenLoading(false);
        // show popup
        if(title === 'Error'){
            console.log("Error: " + body);
        }
        setErrorMessage(body);
        setModalVisible(true);
    }

    // send data to server
    const send_data = async () =>{
        try{
            // send api request to logout and include header
            const res = await axios.get(BASE_URL + '/api/authenticate/logout',{
                headers: {
                    'Authorization': 'bearer ' + VARIABLES.user_token
                }
            });
            // get response from server
            const data = res['data'];
            // check if request was successful
            if(data['success'] === true)
            {
                // update user_token in db
                const t = await update_config('user_token','');
                // check if it worked
                if(t.success){
                    // reset user_token in file
                    VARIABLES.user_token = '';
                    // show popup saying logged out
                    show_modal('Logged Out','Notification');
                }else{
                    show_modal(t.error,'Error');
                }
            }else{
                show_modal(data['error'],'Error');
            }
        }catch(error){
            error.message = "Not logged in";
            show_modal(error.message,'Error');
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
            <CustomButton label={"Logout"} onPress={() => {send_data()}} />
        </View>
    );
};

export default SettingPage;