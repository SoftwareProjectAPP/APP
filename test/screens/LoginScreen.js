import axios from 'axios';
import * as Speech from 'expo-speech';
import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import styles_trail from "../components/common/button/trailButton.style";
import PopupErrorMessage from '../components/popupErrorMessage';
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';

const speak = () => {
    const Voice = 'Hi, this is the login screen if you have account please sign in with email first and password next if not then at the bottom of the page press the register but';
    Speech.speak(Voice);
}

const LoginScreen = ({navigation}) => {
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const validate_data = () =>{
        var error_message = "";
        if(email.length === 0)
        {
            error_message = "Email cant be empty";
        }
        if(password.length === 0)
        {
            error_message = "Password cant be empty";
        }
        if(error_message.length === 0)
        {
            send_data();
        }else{
            // show popup
            console.log("Error: " + error_message);
            setErrorMessage(error_message);
            setModalVisible(true);
        }
    }

    const send_data = async () =>{
        const user_data = {
            email: email,
            password: password
        };
        const res = await axios.post(BASE_URL + '/api/authenticate/login',user_data);
        const data = res["data"];

        if(data["success"] === true){
            VARIABLES.user_token = data["token"];
            navigation.navigate('Home');
        }else{
            // show popup
            console.log("Error: " + data["error"]);
            setErrorMessage(error_message);
            setModalVisible(true);
        }
    }

    return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <PopupErrorMessage 
            error_message={error_messaged} 
            modalVisible={modalVisible} 
            setModalVisible={setModalVisible} 
        />
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
                <Text style={{color: "#00894C", fontWeight: '900'}}> Register</Text>
            </TouchableOpacity>
        </View>
        </View>
    </SafeAreaView>
    );
};

export default LoginScreen;