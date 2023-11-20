import axios from 'axios';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { BASE_URL } from '../constants/config';
import Spinner from 'react-native-loading-spinner-overlay';
import Overlay from 'react-native-modal-overlay';

const Register = ({navigation}) => {
    // state variables
    const [error_messaged, setErrorMessage] = React.useState('');
    const [error_message_title, setErrorMessageTitle] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [email, onChangeEmail] = React.useState('');
    const [first_name, onChangeFirstName] = React.useState('');
    const [last_name, onChangeLastName] = React.useState('');
    const [question1, onChangeQuestion1] = React.useState('');
    const [question2, onChangeQuestion2] = React.useState('');
    const [answer1, onChangeAnswer1] = React.useState('');
    const [answer2, onChangeAnswer2] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [confirm_password, onChangeConfirmPassword] = React.useState('');
    const [isScreenLoading, setScreenLoading] = React.useState(false);

    const show_error = (error_message) => {
        setErrorMessageTitle('Error');
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
    }

    // check if password meet complexity requirements
    const validate_password = () => {
        // check if password meets length requirement
        if(password.length < 8)
        {
            return false;
        }
        // check if password matches confirm password
        return password === confirm_password;
    }

    // validate input field
    const validate_data = () => {
        setScreenLoading(true);
        // show error message
        var error_message = "";
        // check if password is valid
        if(!validate_password())
        {
            error_message = "Invalid password. Try Again.";
        }
        // check if fields are empty
        if(email === "")
        {
            error_message = "Invalid email. Try Again.";
        }
        if(first_name === "")
        {
            error_message = "Invalid First Name. Try Again.";
        }
        if(last_name === "")
        {
            error_message = "Invalid Last Name. Try Again.";
        }
        if(question1 === "")
        {
            error_message = "Invalid question one. Try Again.";
        }
        if(question2 === "")
        {
            error_message = "Invalid question two. Try Again.";
        }
        if(answer1 === "")
        {
            error_message = "Invalid answer one. Try Again.";
        }
        if(answer2 === "")
        {
            error_message = "Invalid answer two. Try Again.";
        }
        // check if error
        if(error_message.length === 0)
        {
            // send data to server
            send_data();
        }else{
            // show popup with error message as the contents
            show_error(error_message);
        }
        
    }

    // send data to server using POST requet
    const send_data = async () => {
        try{
            // show loading icon
            setScreenLoading(true);
            // encode data
            const user_data = {
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                question1: question1,
                question2: question2,
                answer1: answer1,
                answer2: answer2
            };

            // do api request
            const res = await axios.post(BASE_URL + "/api/authenticate/register",user_data);

            // get data from server
            const data = res["data"];
            
            // check if data worked
            if(data["success"] === true){
                // redirect to login page
                setScreenLoading(false);
                navigation.navigate('LoginScreen');
            }else{
                // pop up
                show_error(data['error']);
            }
        }catch(error){
            show_error(error);
        }
    }

    // error modal styles
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

    //This is the layout of the Register Screen
    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
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
            <View style={[styles_Times.container,styles_Times.horizontal]}>
                <Spinner
                    visible={isScreenLoading}
                    textContent={'Loading...'}
                    textStyle={{color:'#FFF'}}
                />
            </View>
            <ScrollView>
                <View style={{paddingHorizontal: 25}}>
                    <View style={{alignItems: 'center'}}>
                    </View>
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: '500',
                            color: '#00894C',
                            marginBottom: 30,
                        }}>
                        Registration
                    </Text>
                    <InputField
                        label={'First Name'}
                        icon={
                            <MaterialIcons
                            name="alternate-email"
                            size={20}
                            color="#00894C"
                            style={{marginRight: 5}}
                        />
                        }
                        keyboardType="email-address"
                        textValue={first_name}
                        onChangeTextF={onChangeFirstName}
                    />
                    <InputField
                        label={'Last Name'}
                        icon={
                            <MaterialIcons
                            name="alternate-email"
                            size={20}
                            color="#00894C"
                            style={{marginRight: 5}}
                        />
                        }
                        keyboardType="email-address"
                        textValue={last_name}
                        onChangeTextF={onChangeLastName}
                    />
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
                        fieldButtonFunction={() => {}}
                        textValue={password}
                        onChangeTextF={onChangePassword}
                    />
                    <InputField
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
                    />
                    <InputField
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
                    />
                    <InputField
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
                    />
                    <InputField
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
                    />
                    <InputField
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
                    />
                    <CustomButton label={"Register"} onPress={() => validate_data()} />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginBottom: 30,
                        }}>
                        
                    </View>
                </View>
            </ScrollView>
    </SafeAreaView>
    );
};

export default Register;