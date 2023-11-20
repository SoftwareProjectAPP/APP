import React from 'react';
import { Image,Text, Scrollview, StyleSheet, View } from 'react-native';
import { VARIABLES } from '../constants/config';
import { get_trail_parking_data } from '../constants/database';
import Spinner from 'react-native-loading-spinner-overlay';
import Overlay from 'react-native-modal-overlay';
import styles_Welcome from '../components/home/welcome/welcome.style';

export  default function ParkingScreen({navigation}){
    // state variables
    const [image_url3, setImageURL3] = React.useState('TBD');
    const [image_url4, setImageURL4] = React.useState('TBD');
    const [image_url5, setImageURL5] = React.useState('TBD');

    // loading and error state variables
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [error_message_title, setErrorMessageTitle] = React.useState('');

    // show error message
    const show_error = (error_message) => {
        setErrorMessageTitle('Error');
        // hide loading icon
        setScreenLoading(false);
        // show popup
        console.log("Error: " + error_message);
        setErrorMessage(error_message);
        setModalVisible(true);
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
            <Overlay
                visible={modalVisible}
                onClose={()=>{setModalVisible(false);}}
                containerStyle={{backgroundColor: 'rgba(90, 90, 90, 0.5)'}}
                childrenWrapperStyle={{backgroundColor: '#fff'}}
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
            <Text style={styles_Welcome.pictureTitle}>Map</Text>
            <View>
                <Image
                    source ={{uri: image_url3}}
                    resizeMode='cover'
                    style={{width: 400, height: 200}}
                />
            </View>
    
            <Text style={styles_Welcome.pictureTitle}>Parking</Text>
            <View>
                <Image
                    source ={{uri: image_url4}}
                    resizeMode='cover'
                    style={{width: 400, height: 200}}
                />
            </View>
            
            <Text style={styles_Welcome.pictureTitle}>Trailhead</Text>
            <View>
                <Image
                    source ={{uri: image_url5}}
                    resizeMode='cover'
                    style={{width: 400, height: 250}}
                />
            </View>
        </View>
    );
};