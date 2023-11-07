
/*
options={{
            headerStyle:{backgroundColor: COLORS.lightWhite},
            headerShadowVisible: false,
            headerLeft: () => (
                <ScreenHeaderBtn1 iconUrl={icons.left} dimension= "90%"/> //back arrow button
            ),
            headerRight: () => (
                <ScreenHeaderBtn1 iconUrl={icons.speaker} dimension="80%"/> //speaker button read off what on the screen
            ),
            headerTitle: "Setting",
            headerTitleAlign: 'center',
        }}
*/

import { Text, View } from 'react-native';

export default function SettingPage(){
//<SafeAreaView style={{flex: 1, backgroundColor: COLORS.lightGreen}}> </SafeAreaView>
    return (
        <View style={{marginTop:'60%',marginLeft:'35%'}}>
            <Text>to be announced</Text>
        </View>
    )
}