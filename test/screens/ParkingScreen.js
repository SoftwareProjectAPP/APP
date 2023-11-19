import React from 'react';
import { ActivityIndicator, Image,Text, Scrollview, StyleSheet, View } from 'react-native';
import PopupErrorMessage from '../components/popupErrorMessage';
import { VARIABLES } from '../constants/config';
import { get_trail_parking_data } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';

export  default function ParkingScreen({navigation}){
    // state variables
    const [image_url3, setImageURL3] = React.useState('TBD');
    const [image_url4, setImageURL4] = React.useState('TBD');
    const [image_url5, setImageURL5] = React.useState('TBD');

    // loading and error state variables
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    // reads speech data
    const speak = () => {
        // data to read
        const voice = 'Hello, Welcome to TrailBlazer your Hiking Companion!'; //think we can take out
        speak_data(voice);
    }

    // show error message
    const show_error = (error_message) => {
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
        throw new Error(error_message);
    }

    // get trail parking data from local database
    const get_parking_data = async () =>{
        try{
            // show screen loading
            setScreenLoading(true);
            // get trail parking data from db
            const t = await get_trail_parking_data(VARIABLES.trail_id);
            console.log("t = ");
            console.log(t);

            // check if data retrieval worked
            if(t.success === true){
                console.log("parking data: ");
                console.log(t.data[0]);

                // get trail data
                const trail_data = t.data[0];
                // set  state variables
                setImageURL3(trail_data.image_URL3);
                setImageURL4(trail_data.image_URL4);
                setImageURL5(trail_data.image_URL5);

                // set header title
                navigation.setOptions({headerTitle: trail_data.name});

                // hide screen loading
                setScreenLoading(false);
            }else{
                show_error(t.error);
            }
        }catch(err){
            show_error(err);
        }
    }

    // run function when app starts
    React.useEffect(()=>{
        get_parking_data();
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

    return(
        <View>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                {isScreenLoading && <ActivityIndicator />}
                <PopupErrorMessage
                    error_message={error_messaged}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
            </View>
            <View>
                <Image
                    source ={{uri: image_url3}}
                    resizeMode='cover'
                    style={{width: 400, height: 200, }}
                />
            </View>

            <View style ={{width: '100%', height: 20}}>
            </View>

            <View>
                <Image
                    source ={{uri: image_url4}}
                    resizeMode='cover'
                    style={{width: 400, height: 200, }}
                />
            </View>

            <View style ={{width: '100%', height: 20}}>
            </View>
            
            <View>
                <Image
                    source ={{uri: image_url5}}
                    resizeMode='cover'
                    style={{width: 400, height: 200, }}
                />
            </View>
        </View>
    );
};