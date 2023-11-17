import axios from 'axios';
import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import styles_trail from "../components/common/button/trailButton.style";
import PopupErrorMessage from '../components/popupErrorMessage';
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';
import { update_config } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';

const LoginScreen = ({navigation}) => {
    // state variables
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [isScreenLoading, setScreenLoading] = React.useState(false);

    // reads speech data
    const speak = () => {
        const voice = 'In the login screen, please enter your email and password.';
        // max size is 4k characters
        speak_data(voice);
    }

    const show_error = (error_message) => {
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
        throw new Error(error_message);
    }

    // validates email and password requirements
    const validate_data = () =>{
        // show loading icon
        setScreenLoading(true);
        // error message
        var error_message = "";
        // check if email is empty
        if(email.length === 0)
        {
            error_message = "Email cant be empty";
        }
        // check if password is empty
        if(password.length === 0)
        {
            error_message = "Password cant be empty";
        }
        // check if there is an error
        if(error_message.length === 0)
        {
            // send data to server
            send_data();
        }else{
            // show error message
            show_error(error_message);
        }
    }

    // send data to server
    const send_data = async () =>{
        try{
            // encode POST data as JSON object
            const user_data = {
                email: email,
                password: password
            };
            // perform POST request to endpoit and wait for server reply
            const res = await axios.post(BASE_URL + '/api/authenticate/login',user_data);
            // retrieve data field from server response
            const data = res["data"];

            // check flag for server error
            if(data["success"] === true){
                // no error
                // set user token to store session information
                const t = await update_config('user_token',data['token']);
                // check if token was stored properly
                if(t.success === false)
                {
                    show_error(t.error);
                }
                // hide loading icon
                setScreenLoading(false);
                // store user token in variables for fast retrieval
                VARIABLES.user_token = data["token"];
                // navigate to home screen
                navigation.navigate('Home');
            }else{
                show_error(data["error"]);
            }
        }catch(err){
            show_error(err);
        }
        
    }
    // login styles
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

    //This is the layout of the Login Screen
    return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <View style={{paddingHorizontal: 25}}>
            <View style={{alignItems: 'left'}}>
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
            </View>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                {isScreenLoading && <ActivityIndicator />}
                <PopupErrorMessage
                    error_message={error_messaged}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
            </View>
            <Text
                style={{
                    fontSize: 36,
                    fontWeight: '500',
                    color: '#00894C',
                    marginBottom: 30,
                }}>
                Login
            </Text>
            <InputField
                label={'Email ID'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                />
                }
                keyboardType="email-address"
                textValue={email}
                onChangeTextF={onChangeEmail}
            />
            <InputField
                label={'Password'}
                icon={
                    <Ionicons
                    name="ios-lock-closed-outline"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                    />
                }
                inputType="password"
                fieldButtonLabel={"Forgot?"}
                fieldButtonFunction={() => {navigation.navigate('forgot')}}
                textValue={password}
                onChangeTextF={onChangePassword}
            />
            <CustomButton label={"Login"} onPress={() => {validate_data()}} />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={{color: "#00894C", fontWeight: '800',fontSize: SIZES.large }}> Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
    );
};

export default LoginScreen;