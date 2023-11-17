import { Audio } from 'expo-av';
import React from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styles_footer_trail from '../components/common/footer/footer_Overview.style';
import PopupErrorMessage from '../components/popupErrorMessage';
import { icons } from '../constants';
import { VARIABLES } from '../constants/config';
import { get_checklist_for_trail, get_trail_by_id } from '../constants/database';
import { speak_data } from '../constants/text_to_speech';

//Audio urls
//images urls

const TrailOverviewTemplate = ({navigation}) => {
    // state variables
    const [description, setDescription] = React.useState('TBD');
    const [image_url, setImageURL] = React.useState('TBD');
    const [image_url2, setImageURL2] = React.useState('TBD');
    const [image_url3, setImageURL3] = React.useState('TBD');
    const [image_url4, setImageURL4] = React.useState('TBD');
    const [image_url5, setImageURL5] = React.useState('TBD');
    const [mileage, setMileage] = React.useState('');
    const [rating, setRating] = React.useState('');
    const [trail_check_list, setTrailCheckList] = React.useState([]);
    const [is_wheelchair_accessible, setIsWheelChairAccessible] = React.useState('');
    const [audio_url, setAudioURL] = React.useState();

    // loading and error state variables
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    // reads speech data
    const speak = () => {
        // data to read
        const voice = 'Hello, Welcome to TrailBlazer your Hiking Companion!';
        speak_data(voice);
    }

    // play audio data in audio_url
    const play_audio_data = async () =>{
        const sound = new Audio.Sound();
        await sound.loadAsync({uri: audio_url});
        await sound.playAsync();
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

    // get trail data from local database
    const get_trail_data = async () =>{
        try{
            setScreenLoading(true);
            // get trail data from local db
            const t = await get_trail_by_id(VARIABLES.trail_id);

            console.log("t=");
            console.log(t);

            // check if data retrieval worked
            if(t.success === false){
                show_error(t.error);
            }else{
                // get trail data
                console.log("trail_data = ")
                console.log(t.data[0]);

                const trail_data = t.data[0];

                // set state varaibles
                setDescription(trail_data.description);
                setImageURL(trail_data.image_URL);
                setImageURL2(trail_data.image_URL2);
                setImageURL3(trail_data.image_URL3);
                setImageURL4(trail_data.image_URL4);
                setImageURL5(trail_data.image_URL5);
                setMileage(trail_data.mileage);
                setRating(trail_data.rating);
                console.log("audio_URL = " + trail_data.audio_URL);
                setAudioURL(trail_data.audio_URL);
                setIsWheelChairAccessible(trail_data.is_wheelchair_accessible);
                const trail_name = trail_data.name;
                // set app header to trail name
                navigation.setOptions({headerTitle: trail_name});

                // get checklist for trail
                const t2 = await get_checklist_for_trail(VARIABLES.trail_id);
                // check if worked
                if(t2.success === false){
                    show_error(t2.error);
                }else{
                    // show trail data
                    console.log("trail_check_list = ");
                    console.log(t2.data);
                    setTrailCheckList(t2.data);
                    setScreenLoading(false);
                }
            }
        }catch(error){
            show_error(error);
        }
    }

    // run function when app starts
    React.useEffect(()=>{
        get_trail_data();
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

    const boxStyles = StyleSheet.create({
        container: {
            flex: 1,
        },
        boxContainer: {
            width: '100%',
            height: '75%',
            padding: 5,
            flexdirection:'row',
            flexWrap: 'wrap'
        },
        box: {
            width: '50%',
            height: '30%',
            padding: 5,
            backgroundColor: 'green',
        },
        boxTransparent: {
            width: '50%',
            height: '47%',
            padding: 1,
            backgroundColor: 'rgba(0,0,0,0)',
        },
        inner: {
            flex: 1,
            backgroundColor:'#c8c8c8',
            alignItems: 'center',
        },
        innerSmall: {
            flex: 1,
            backgroundColor:'#c8c8c8',
            alignItems: 'center',
            margin:10
        },
        Mileagetext: {
            textAlign: 'left',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            //textAlignmentsVertical: 'top'
        },
        Ratingtext: {
            textAlign: 'left',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            //textAlignmentsVertical: 'bottom'
        },
        Wheelechairtext: {
            textAlign: 'left',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            //textAlignmentsVertical: 'bottom'
        },
        DescriptionText:
        {
            textAlign: 'left',
            justifyContent: 'center',
            fontSize: 18,
            padding: 2,
            //textAlignmentsVertical: 'top'
        },
        CheckListText:
        {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 16,
            padding: 2,
            //textAlignmentsVertical: 'top'
        },
        CheckListHeader:
        {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 19,
            fontWeight: 'bold',
            padding: 2,
            //textAlignmentsVertical: 'top'
        },
        AudioFooter:
        {
            width: '50',
            height: '50',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: '0'
        }
    });

    return(
        <View style={{flex: 1}}>
            <View style={[styles_Times.container, styles_Times.horizontal]}>
                {isScreenLoading && <ActivityIndicator />}
                <PopupErrorMessage
                    error_message={error_messaged}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
            </View>
            <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
                <View>
                    <View>
                        <View>
                            <Image
                                source ={{uri: image_url}}
                                resizeMode='cover'
                                style={{width: 400, height: 150, }}
                            />
                        </View>
                    </View>
                    <View style={boxStyles.boxContainer}>
                        <View style={boxStyles.boxTransparent}>
                            <Text style={boxStyles.DescriptionText}>
                                {description}
                            </Text>
                        </View>
                        <View style={boxStyles.boxTransparent}>
                            <Image
                                source ={{uri: image_url}}
                                resizeMode='cover'
                                style={{width: '100%', height: '95%', }}
                            />
                        </View>
                        <View style={boxStyles.box}>
                            <View style={boxStyles.innerSmall}>
                                <Text style={boxStyles.Mileagetext}>Mileage: {mileage} </Text>
                                <View style = {{width:'100%', height: 30}}/>
                                <Text style={boxStyles.Ratingtext}>Rating: {rating} </Text>
                                <Text style={boxStyles.Wheelechairtext}>Wheelchair: {is_wheelchair_accessible} </Text>
                            </View>
                        </View>
                        <View style={boxStyles.boxTransparent}>
                            <Text style={boxStyles.CheckListHeader}>Checklist</Text>
                            <FlatList
                                data={trail_check_list}
                                renderItem={({item})=><Text style={boxStyles.CheckListText}>{item.item}</Text>}
                            />
                        </View>
                    </View>
                </View>
                <View style ={{width: 400, height:100}}>
                </View>
            </ScrollView>
            <View style={styles_footer_trail.container}>
                <TouchableOpacity
                    style={styles_footer_trail.audioBtn}
                    onPress={play_audio_data} >
                        <Image
                            source={icons.speaker} //Change to the speaker
                            resizeMode='contain'
                            style={styles_footer_trail.likeBtnImage}
                        />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles_footer_trail.applyBtn}
                    onPress={() => navigation.navigate('')}
                >
                <Text style={styles_footer_trail.applyBtnText}>Parking & TrailHead</Text>
                </TouchableOpacity>
            </View>
        </View>
)};

export default TrailOverviewTemplate;