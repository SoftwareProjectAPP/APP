import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { ScreenHeaderBtn, Welcome, } from '../components';
import { COLORS, SIZES, icons } from '../constants';

const Home = () => {
    const router = useRouter();

    return ( <SafeAreaView style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
        <Stack.Screen
        options={{
            headerStyle:{backgroundColor: COLORS.lightWhite},
            headerShadowVisible: false,
            headerLeft: () => (
                <ScreenHeaderBtn iconUrl={icons.list} dimension="60%" /> // This is the left button for List of trails
            ),
            headerRight: () => (
                <ScreenHeaderBtn iconUrl={icons.setting} dimension="60%" />//This is the right button for setting page
            ),
            headerTitle: ""
        }}
        />

        <ScrollView showsVerticalScrollIndicator= {false}>
            <View
            style={{
                flex: 1,
                padding: SIZES.medium,
            }}
            >
            <Welcome

            />
            </View>
        </ScrollView>
    </SafeAreaView>
    )
}

export default Home;
