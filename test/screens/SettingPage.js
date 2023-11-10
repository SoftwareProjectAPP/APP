import axios from 'axios';
import { View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { BASE_URL, VARIABLES } from '../constants/config';
import { update_config } from '../constants/database';

const SettingPage = ({navigation}) => {
    const send_data = async () =>{
        console.log("token = ");
        console.log(VARIABLES.user_token);
        const res = await axios.get(BASE_URL + '/api/authenticate/logout',{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        const data = res['data'];
        console.log("data = " );
        console.log(data);
        if(data['success'] === true)
        {
            const t = await update_config('user_token','');
            if(t.success){
                VARIABLES.user_token = '';
            }else{
                throw new Error(t.error);
            }
        }else{
            console.log("Error: " + data['error']);
        }
    }
    return (
        <View>
            <CustomButton label={"Logout"} onPress={() => {send_data()}} />
        </View>
    );
};

export default SettingPage;