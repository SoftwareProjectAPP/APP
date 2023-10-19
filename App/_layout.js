import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


const Layout = () => {
    /*const [fontsLoaded] = useFonts({
        DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
        DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
        DMRegular: require('../assets/fonts/DMSans-Regular.ttf'),
    })

    const onLayoutRootView = useCallback(async () => {
    if(fontsLoaded){
        await SplashScreen.hideAsync();    //this is tell the homepage
    }                                      //wait to load for the fonts to pop up
    })*/

    return <Stack />;

}

export default Layout;