import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS, SIZES } from "../constants";
import { BASE_URL, VARIABLES } from '../constants/config';

const AchievementScreen = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [achievement_id, setAchievementId] = useState('');

    const get_all = async () =>{
        const res = await axios.get(BASE_URL + '/api/achievements/getall',{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        const data = res["data"];
        if(data["success"] === true){
            const achievements = data["achievements"];
            achievements.forEach(row =>{
                const id = row["id"];
                const title = row["title"];
            });
        }else{
            // show popup error message
            console.log("Error: " + data["error"]);
        }
    }

    React.useEffect(()=>{
        get_all();
    }, []);

    const get_user = async () =>{
        const res = await axios.get(BASE_URL + '/api/achievements/getuser',{
            headers: {
                'Authorization': 'bearer ' + VARIABLES.user_token
            }
        });
        const data = res["data"];
        if(data["success"] === true){
            const achievements = data["user_achievements"];
            console.log("achievements");
            console.log(achievements);
            achievements.forEach(row =>{
                const id = row["id"];
                const title = row["title"];
            });
        }else{
            // show popup error message
            console.log("Error: " + data["error"]);
        }
    }

    const add = async () =>{
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
    }

    return (
        <View style={styles.container}>
            <Text style={styles.trail_name}>Trail name</Text>
        <Switch
            trackColor={{false: '#767577', true: '#00894C'}}
            thumbColor={isEnabled ? '#767577' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default AchievementScreen;