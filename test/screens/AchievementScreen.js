import axios from 'axios';
import React from 'react';
import { FlatList, View } from 'react-native';
import AchievementComponent from '../components/AchievementComponent';
import { BASE_URL, VARIABLES } from '../constants/config';

// TODO: test and complete screen

const AchievementScreen = () => {
    const get_all = async () =>{
        const res = await axios.get(BASE_URL + '/api/achievements/getall',{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        const data = res["data"];
        if(data["success"] === true){
            const achievements = data["achievements"];
            console.log("achievements = ");
            console.log(achievements);
            /*achievements.forEach(row =>{
                const id = row["id"];
                const title = row["title"];
            });*/
        }else{
            // show popup error message
            console.log("Error: " + data["error"]);
        }
    }

    React.useEffect(()=>{
        get_all();
    }, []);

    const add = async (achievement_id) =>{
        const user_data = {
            achievement_id: achievement_id
        };
        const res = await axios.post(BASE_URL + '',{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        const data = res["data"];

        if(data["success"] === true){
            // show popup
            console.log("add successful");
            // change achievement to "true"
        }else{
            // show popup
            console.log("Error: " + data["error"]);
        }
        return true;
    }

    return (
        <View>
            <FlatList
                data={[
                    {
                        achievement_id: 1,
                        achievement_name: 'a',
                        is_enabled: true,
                    },
                    {
                        achievement_id: 3,
                        achievement_name: 'c',
                        is_enabled: true,
                    },
                    {
                        achievement_id: 2,
                        achievement_name: 'b',
                        is_enabled: false,
                    }
                ]}
                renderItem={({item}) => <AchievementComponent achievement_name={item.achievement_name} achievement_id={item.achievement_id} is_enabled={item.is_enabled} add_achievement_parent={add}/>}
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