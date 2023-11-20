import AchievementScreen from './screens/AchievementScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import Register from './screens/Register';
import SecurityQuestionScreen from './screens/SecurityQuestionScreen';
import SettingPage from './screens/SettingPage';
import TrailListPage from './screens/TrailListPage';
import TrailOverviewTemplate from './screens/TrailOverviewTemplate';
import ParkingScreen from './screens/ParkingScreen';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import styles from './components/common/header/screenheader.style';

const Stack = createNativeStackNavigator();

// TODO: add style to titles in parking screen
// TODO: add style to error message popup

// register all pages you can navigate to and initial route
export default function App(){
    return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{contentStyle:{backgroundColor:'#F5F5F5'}}} initialRouteName='Home'>
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
                        <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('SettingPage')}>
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
                name="SettingPage"
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
                name="TrailOverviewTemplate"
                component={TrailOverviewTemplate}
                options={{headerTitle: ""}}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{headerTitle: ''}}
            />
            <Stack.Screen
                name="forgot"
                component={SecurityQuestionScreen}
                options={{headerTitle: ''}}
            />
            <Stack.Screen
                name="parking"
                component={ParkingScreen}
                options={{headerTitle: ''}}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
};

/*
trail:
    INSERT INTO trail(image_URL, audio_URL, name, description, mileage, rating, is_wheelchair_accessible) VALUES();

get trail id:
    SELECT * FROM trail;

trailchecklists:
    INSERT INTO trailchecklists(item, trail_id, trailId) VALUES();
*/