import axios from 'axios';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import PopupErrorMessage from '../components/popupErrorMessage';
import { BASE_URL } from '../constants/config';

const SecurityQuestionScreen = ({navigation}) => {
    // state vriables
    const [email, onChangeEmail] = React.useState('');
    const [question1, onChangeQuestion1] = React.useState('');
    const [question2, onChangeQuestion2] = React.useState('');
    const [answer1, onChangeAnswer1] = React.useState('');
    const [answer2, onChangeAnswer2] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [confirm_password, onChangeConfirmPassword] = React.useState('');
    const [should_change_password, setShouldChangePassword] = React.useState(false);
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    const show_error = (error_message) => {
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
        throw new Error(error_message);
    }

    // check if password meets complexity requirements
    const validate_password = () => {
        // check if it meets password length
        if(password.length < 8)
        {
            return false;
        }
        // check if password = confirm password
        return password === confirm_password;
    }

    // check if data is valid
    const validate_data = () => {
        try{
            setScreenLoading(true);
            //error message
            var error_message = "";
            // check if should change password
            if(should_change_password === true)
            {
                // check fields related to that
                if(!validate_password())
                {
                    error_message = "Invalid password. Try Again.";
                }
                
                if(answer1 === "")
                {
                    error_message = "Invalid answer one. Try Again.";
                }
                if(answer2 === "")
                {
                    error_message = "Invalid answer two. Try Again.";
                }
            }
            else
            {
                // check fields
                if(email === "")
                {
                    error_message = "Invalid email. Try Again.";
                }
            }
            
            // check if error
            if(error_message.length === 0)
            {
                if(should_change_password === true){
                    // change password
                    change_password();
                }
                else
                {
                    // get security question
                    get_security_question();
                }
            }else{
                // show popup with error message as the contents
                show_error(error_message);
            }
        }catch(error){
            show_error(error);
        }
    }

    // get security questions from server
    const get_security_question = async () => {
        try{
            // show loading icon
            setScreenLoading(true);
            // encode data
            const user_data = {
                email: email
            };

            // do POST request
            const res = await axios.post(BASE_URL + "/api/authenticate/forgot",user_data);

            // get server response
            const data = res["data"];
            
            if(data["success"] === true){
                // redirect to login page
                setScreenLoading(false);
                onChangeQuestion1(data["security_question1"]);
                onChangeQuestion2(data["security_question2"]);
                setShouldChangePassword(true);
            }else{
                // pop up
                console.log("Error: " + data["error"]);
                setErrorMessage(error_message);
                setModalVisible(true);
            }
        }catch(error){
            show_error(error);
        }
    }

    // change password server call
    const change_password = async () => {
        try{
            // encode data
            const user_data = {
                email: email,
                password: password,
                question1: question1,
                question2: question2,
                answer1: answer1,
                answer2: answer2
            };
    
            // make POST request
            const res = await axios.post(BASE_URL + "/api/authenticate/forgot/change",user_data);
    
            // get server response
            const data = res["data"];
            
            if(data["success"] === true){
                // redirect to login page
                navigation.navigate('LoginScreen');
            }else{
                // pop up
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
    })

    return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <View style={{paddingHorizontal: 25}}>
            <View style={{alignItems: 'center'}}>
                <View style={[styles_Times.container,styles_Times.horizontal]}>
                    {isScreenLoading && < ActivityIndicator size="large" color="#00894C" />}
                    <PopupErrorMessage
                    error_message={error_messaged}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    />
                </View>
            </View>
            {should_change_password === false && <InputField
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
            }
            {should_change_password === true && <Text
                style={{
                    fontSize: 28,
                    fontWeight: '500',
                    color: '#00894C',
                    marginBottom: 30,
                }}>
                Security Questions:
            </Text>}
            {should_change_password === true && <InputField
                label={'Security Question 1'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                />
                }
                keyboardType="email-address"
                textValue={question1}
                onChangeTextF={onChangeQuestion1}
            />}
            {should_change_password === true && <InputField
                label={'Security Answer 1'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                />
                }
                keyboardType="email-address"
                textValue={answer1}
                onChangeTextF={onChangeAnswer1}
            />}
            {should_change_password === true && <InputField
                label={'Security Question 2'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                />
                }
                keyboardType="email-address"
                textValue={question2}
                onChangeTextF={onChangeQuestion2}
            />}
            {should_change_password === true && <InputField
                label={'Security Answer 2'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                />
                }
                keyboardType="email-address"
                textValue={answer2}
                onChangeTextF={onChangeAnswer2}
            />}
            {should_change_password && <InputField
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
                fieldButtonFunction={() => {}}
                textValue={password}
                onChangeTextF={onChangePassword}
            />}
            {should_change_password === true &&<InputField
                label={'Comfirm Password'}
                icon={
                    <Ionicons
                    name="ios-lock-closed-outline"
                    size={20}
                    color="#00894C"
                    style={{marginRight: 5}}
                    />
                }
                inputType="password"
                fieldButtonFunction={() => {}}
                textValue={confirm_password}
                onChangeTextF={onChangeConfirmPassword}
            />}
            <CustomButton label={"Comfirm"} onPress={() => validate_data()} />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                
            </View>
        </View>
    </SafeAreaView>
    );
};

export default SecurityQuestionScreen;