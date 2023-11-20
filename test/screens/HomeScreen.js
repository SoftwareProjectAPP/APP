import axios from 'axios';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styles_trail from "../components/common/button/trailButton.style";
import styles_Welcome from '../components/home/welcome/welcome.style';
import { SIZES } from '../constants';
import { BASE_URL, VARIABLES } from '../constants/config';
import { add_trail_checklist_data, add_trail_data, setup, setup_config, update_config } from '../constants/database';
import { download_file_from_url } from '../constants/filestorage';
import { speak_data } from '../constants/text_to_speech';
import Overlay from 'react-native-modal-overlay';
import Spinner from 'react-native-loading-spinner-overlay';

export default function HomeScreen({navigation}){
    // state variables (used for error messages and loading)
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [error_message_title, setErrorMessageTitle] = React.useState('');

    const show_error = (error_message) => {
        setErrorMessageTitle(error_message_title);
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
    }

    // reads speech data
    const speak = () => {
        // data to read
        const voice = "Hello, Welcome to TrailBlazer your Hiking Companion!. At the top of the screen, there's a button for the trail list screen on the left, and on the right, there's a button for the settings screen.";
        speak_data(voice);
    }

    // get data from SERVER
    const get_data = async () => {
        try{
            setScreenLoading(true);
            console.log("db_version before = ");
            console.log(VARIABLES.DB_VERSION);
            // setup configuration variables (user_token, db_version, and trail_id) in database for persistent storage
            const c = await setup_config();
            console.log("c = ");
            console.log(c);
            // check if setup worked
            if(c.success){
                // worked
                console.log("Local variables configured");
            }else{
                // failed. show error message
                show_error(c.error);
            }
            console.log("db_version = ");
            console.log(VARIABLES.DB_VERSION);

            // make API GET request
            const res = await axios.get(BASE_URL + "/api/getinfo/" + VARIABLES.DB_VERSION);

            // get data from server response
            const data = res["data"];

            console.log("axios data = ");
            console.log(data);

            // check if data retrieval worked
            if(data["success"] === true){
                // check if server db version matches local version
                if(data["current_version"] == true){
                    // if it does then ignore
                    console.log("Version match");
                    // hide loading icon
                    setScreenLoading(false);
                }else{
                    // else populate local database with server data
                    console.log("versions dont match");
                    // create tables and empty them if the tables already exist
                    const t = await setup();
                    console.log("t = ");
                    console.log(t);
                    // check if table creation worked
                    if(t.success){
                        // object to hold data to store in db
                        var obj = {};
                        // table creation worked
                        console.log("it worked");
                        // get database data
                        const new_version = data["new_version"];
                        const trail_list = data["trail_data"];
                        console.log("new_version = " + new_version);
                        // update database version
                        const tr = await update_config('db_version',new_version);
                        // check if upate worked
                        if(tr.success === false)
                        {
                            show_error(tr.error);
                        }
                        // update database version local variable
                        VARIABLES.DB_VERSION = new_version;
                        console.log("trail_list =");
                        console.log(trail_list);
                        // size counter
                        var counter = 0;
                        // iterate over trail list
                        trail_list.forEach(async function(trail){
                            counter++;
                            // iterate over images
                            for(var x = 1;x<6;x++){
                                var title= "image_URL";
                                if(x > 1){
                                    title += x;
                                }
                                console.log("title = " + title);
                                console.log("Called on image: " + trail[title]);
                                // download image from url and store in device
                                // retrieve local file path
                                var image_url = await download_file_from_url(trail[title]);
                                console.log("image_url= ");
                                console.log(image_url);
                                // check if data download worked
                                if(image_url['success'] === false){
                                    //console.log("Error: " + image_url['error']);
                                    //throw new Error(image_url['error']);
                                    show_error(image_url['error']);
                                }
                                // get image_url uri
                                image_url = image_url['uri'];
                                console.log("image_url2=");
                                console.log(image_url);
                                obj[title] = image_url;
                            }
                            
                            console.log("Called on audio: " + trail['audio_URL']);
                            // download audio data from url and retrieve local path
                            var audio_url = await download_file_from_url(trail["audio_URL"]);
                            // check if download worked
                            if(audio_url['success'] === false){
                                // if it didnt then show error message
                                show_error(audio_url['error']);
                                //console.log("Error: " + audio_url['error']);
                                //throw new Error(audio_url['error']);
                            }
                            // get uri from audio_url
                            audio_url = audio_url['uri'];
                            console.log("audio_url2 = ");
                            console.log(audio_url);

                            // add data to object
                            obj['id'] = trail['id'];
                            obj['name'] = trail['name'];
                            obj['description'] = trail['description'];
                            obj['mileage'] = trail['mileage'];
                            obj['rating'] = trail['rating'];
                            obj['is_wheelchair_accessible'] = trail['is_wheelchair_accessible'];
                            obj['audio_url'] = audio_url;

                            // add trail data to local database
                            const t2 = await add_trail_data(obj);
                            // check if it worked
                            if(t2.success === false){
                                // failed so show error
                                show_error(t2.error);
                                //throw new Error(t2.error);
                            }else{
                                // get trail check list
                                const trail_check_list = trail["trailchecklists"];

                                // iterate over trail checklist
                                trail_check_list.forEach(async function(check){
                                    // add trail checklist data to database
                                    const t3 = await add_trail_checklist_data(
                                        {
                                            "item": check["item"],
                                            "trailId": trail["id"]
                                        }
                                    );
                                    // if it failed then show error
                                    if(t3.success === false){
                                        show_error(t3.error);
                                        //throw new Error(t3.error);
                                    }
                                });
                            }
                            // hide loading screen when data is fully loaded
                            if(counter === trail_list.length){
                                setScreenLoading(false);
                            }
                        });
                    }else{
                        // show server error
                        show_error(t.error);
                        //console.log("error:" + t.error);
                        //throw new Error(t.error);
                    }
                }
            }
        }catch(err)
        {
            // show error
            show_error(err);
        }
    }

    // call get data when screen is first shown
    React.useEffect(()=>{
        get_data();
    }, []);

    const styles_Times = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
    });

    //This is the layout of the HomeScreen
    return (
        <View>
            <Overlay
                visible={modalVisible}
                onClose={()=>{setModalVisible(false);}}
                closeOnTouchOutside
            >
                <Text>{error_message_title}</Text>
                <Text>{error_messaged}</Text>
            </Overlay>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                <Spinner
                    visible={isScreenLoading}
                    textContent={'Loading...'}
                    textStyle={{color:'#FFF'}}
                />
            </View>
            <ScrollView>
                <View>
                    <View style={{ flex: 1, padding: SIZES.xxLarge, align:'center'}}>
                        <View style={styles_trail.container}>
                            <TouchableOpacity onPress={speak}>
                                <Image
                                    source={require('../assets/icons/speaker.png')}
                                    resizeMode="cover"
                                    style={{width: 60, height: 60}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles_Welcome.welcomeMessage}>
                        Welcome to TrailBlazer your Hiking Companion!
                    </Text>
                    <Image
                        source ={{uri:'https://storage.googleapis.com/trailblazerdata/MapHomeScreen.jpg'}}
                        resizeMode='cover'
                        style={{width: 400, height: 300, }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
