import axios from 'axios';
import React from 'react';
import { FlatList, View } from 'react-native';
import AchievementComponent from '../components/AchievementComponent';
import { BASE_URL, VARIABLES } from '../constants/config';

const AchievementScreen = () => {
    const [achievement_list, setAchievementList] = React.useState([]);
    const get_all = async () =>{
        const res = await axios.get(BASE_URL + '/api/achievements/getall',{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        const data = res["data"];
        console.log("data = ");
        console.log(data);
        if(data["success"] === true){
            var achievements = data["user_achievements"][0];
            console.log("achievements = ");
            console.log(achievements);
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
            console.log("Error: " + data["error"]);
        }
    }

    React.useEffect(()=>{
        get_all();
    }, []);

    const add = async (achievement_name) =>{
        console.log("add called");
        console.log("achievement_name = ");
        console.log(achievement_name);
        const user_data = {
            achievement_name: achievement_name
        };
        console.log("user_token = ");
        console.log(VARIABLES.user_token);
        const res = await axios.post(BASE_URL + "/api/achievements/add",user_data,{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        console.log("res = ");
        console.log(res);
        const data = res["data"];

        console.log("data = ");
        console.log(data);

        if(data["success"] === true){
            // show popup
            console.log("add successful");
            return true;
            // change achievement to "true"
        }else{
            // show popup
            console.log("Error: " + data["error"]);
            return false;
        }
    }

    return (
        <View>
            <FlatList
                data={achievement_list}
                renderItem={({item}) => <AchievementComponent achievement_name={item.title} is_enabled={item.is_enabled} add_achievement_parent={add}/>}
            />
        </View>
    );
};

/*const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trail_name:{
        fontSize: SIZES.xLarge,
        color: COLORS.secondary,
        textAlign:"center",
        fontWeight: 'bold',
    }
});*/

export default AchievementScreen;