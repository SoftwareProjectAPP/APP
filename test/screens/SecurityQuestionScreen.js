import axios from 'axios';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { BASE_URL } from '../constants/config';

const SecurityQuestionScreen = ({navigation}) => {
    const [email, onChangeEmail] = React.useState('');
    const [question1, onChangeQuestion1] = React.useState('');
    const [question2, onChangeQuestion2] = React.useState('');
    const [answer1, onChangeAnswer1] = React.useState('');
    const [answer2, onChangeAnswer2] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [confirm_password, onChangeConfirmPassword] = React.useState('');
    const [should_change_password, setShouldChangePassword] = React.useState(false);

    const validate_password = () => {
        if(password.length < 8)
        {
            return false;
        }
        return password === confirm_password;
    }

    const validate_data = () => {
        var error_message = "";
        if(should_change_password === true)
        {
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
            if(email === "")
            {
                error_message = "Invalid email. Try Again.";
            }
        }
        
        // repeat for all other fields
        if(error_message.length === 0)
        {
            if(should_change_password === true){
                change_password();
            }
            else
            {
                get_security_question();
            }
        }else{
            // show popup with error message as the contents
            console.log("Error: " + error_message);
        }
        
    }

    const get_security_question = async () => {
        const user_data = {
            email: email
        };

        const res = await axios.post(BASE_URL + "/api/authenticate/forgot",user_data);

        const data = res["data"];
        
        if(data["success"] === true){
            // redirect to login page
            onChangeQuestion1(data["security_question1"]);
            onChangeQuestion2(data["security_question2"]);
            setShouldChangePassword(true);
        }else{
            // pop up
            console.log("Error: " + data["error"]);
        }
    }

    const change_password = async () => {
        const user_data = {
            email: email,
            password: password,
            question1: question1,
            question2: question2,
            answer1: answer1,
            answer2: answer2
        };

        const res = await axios.post(BASE_URL + "/api/authenticate/forgot/change",user_data);

        const data = res["data"];
        
        if(data["success"] === true){
            // redirect to login page
            navigation.navigate('LoginScreen');
        }else{
            // pop up
            console.log("Error: " + data["error"]);
        }
    }

    return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <View style={{paddingHorizontal: 25}}>
            <View style={{alignItems: 'center'}}>

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