import axios from 'axios';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import PopupErrorMessage from '../components/popupErrorMessage';
import { BASE_URL } from '../constants/config';

const Register = ({navigation}) => {
    const [error_messaged, setErrorMessage] = React.useState('');
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

    const validate_password = () => {
        if(password.length < 8)
        {
            return false;
        }
        return password === confirm_password;
    }

    const validate_data = () => {
        var error_message = "";
        if(!validate_password())
        {
            error_message = "Invalid password. Try Again.";
        }
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
        // repeat for all other fields
        if(error_message.length === 0)
        {
            send_data();
        }else{
            // show popup with error message as the contents
            console.log("Error: " + error_message);
            setErrorMessage(error_message);
            setModalVisible(true);
        }
        
    }

    const send_data = async () => {
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

        const res = await axios.post(BASE_URL + "/api/authenticate/register",user_data);

        const data = res["data"];
        
        if(data["success"] === true){
            // redirect to login page
            navigation.navigate('LoginScreen');
        }else{
            // pop up
            console.log("Error: " + data["error"]);
            setErrorMessage(data["error"]);
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
    </SafeAreaView>
    );
};

export default Register;