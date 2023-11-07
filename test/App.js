import AchievementScreen from './screens/AchievementScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import LoneStarTrailScreen from './screens/LoneStarTrailScreen';
import Register from './screens/Register';
import SettingPage from './screens/SettingPage';
import TrailListPage from './screens/TrailListPage';


import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import styles from './components/common/header/screenheader.style';

const Stack = createNativeStackNavigator();

export default function App(){
    return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='AchievementScreen'>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({navigation}) => ({
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity style={styles.btnContainer} onPress={() => navigation.navigate('trailListpage')}>
                            <Image
                            source={require('./assets/icons/list.png')}
                            resizeMode="cover"
                            style={{width: 40, height: 40}}
                            />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('settingpage')}>
                            <Image
                            source={require('./assets/icons/setting.png')}
                            resizeMode="cover"
                            style={{width: 40, height: 40}}
                            />
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen
            name="trailListpage"
            component={TrailListPage}
            options={{headerTitle: ''}}
            />
            
            <Stack.Screen
            name="settingpage"
            component={SettingPage}
            options={{headerTitle: 'Setting', headerTitleAlign: 'center'}}
            />
            
            <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerTitle: ''}}
            />
            <Stack.Screen
            name="AchievementScreen"
            component={AchievementScreen}
            options={{headerTitle: 'Achievements', headerTitleAlign: 'center'}}
            />
            <Stack.Screen
            name="LoneStarTrailScreen"
            component={LoneStarTrailScreen}
            options={{headerTitle: 'Lone Star Trail', headerTitleAlign: 'center'}}
            />
            
            <Stack.Screen
            name="Register"
            component={Register}
            options={{headerTitle: ''}}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
};

