import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS, SIZES } from "../constants";

export default function AchievementComponent({
    achievement_name,
    achievement_id,
    add_achievement_parent,
    is_enabled
}){
    const [isEnabled, setIsEnabled] = React.useState(is_enabled);
    const toggleSwitch = async () => {
        if(isEnabled === false)
        {
            if(await add_achievement_parent(achievement_id) === true)
            {
                is_enabled=true;
                setIsEnabled(true);
            }
        }
    }

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
    return (
        <View style={styles.container}>
            <Text style={styles.trail_name}>{achievement_name}</Text>
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
}