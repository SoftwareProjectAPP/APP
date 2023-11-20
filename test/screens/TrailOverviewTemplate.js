import { Audio } from 'expo-av';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styles_footer_trail from '../components/common/footer/footer_Overview.style';
import { icons } from '../constants';
import { VARIABLES } from '../constants/config';
import { get_checklist_for_trail, get_trail_by_id } from '../constants/database';
import Spinner from 'react-native-loading-spinner-overlay';
import Overlay from 'react-native-modal-overlay';

const TrailOverviewTemplate = ({navigation}) => {
    // state variables
    const [description, setDescription] = React.useState('TBD');
    const [image_url, setImageURL] = React.useState('TBD');
    const [image_url2, setImageURL2] = React.useState('TBD');
    const [mileage, setMileage] = React.useState('');
    const [trail_check_list, setTrailCheckList] = React.useState([]);
    const [is_wheelchair_accessible, setIsWheelChairAccessible] = React.useState('');
    const [audio_url, setAudioURL] = React.useState();
    const [rating_list, setRatingList] = React.useState([]);
    
    let wheelchair_access_icon = is_wheelchair_accessible ? icons.accessibility : icons.notaccessibility
    // loading and error state variables
    const [isScreenLoading, setScreenLoading] = React.useState(false);
    const [error_messaged, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [error_message_title, setErrorMessageTitle] = React.useState('');

    // play audio data in audio_url
    const play_audio_data = async () =>{
        const sound = new Audio.Sound();
        await sound.loadAsync({uri: audio_url});
        await sound.playAsync();
    }

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

    // generate difficulty rating images
    const diffuculty_rating = (rating) => {
        // empty table
        let table = []
        
        // add items to table (JSON encoded to make sure key is unique)
        for(let i = 0; i < rating; i++)
        {
            // push items to lsit
            table.push({
                id: i,
                item: 'a'
            });
        }

        // add items to rating list so it is loaded by flatlist
        setRatingList(table);
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
                setMileage(trail_data.mileage);
                diffuculty_rating(trail_data.rating);
                // trail_data.rating
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
                                <View style = {{width:'100%', height: 20}}/>
                                
                                <Text style={boxStyles.Ratingtext}>Difficulty:</Text>
                                <FlatList
                                    data={rating_list}
                                    keyExtractor={(item,index)=>item.id}
                                    renderItem={({item})=><Image source={icons.hikingman} style={{height: 25, width: 25, resizeMode: 'contain'}}/>}
                                    scrollEnabled={false}
                                    horizontal={true}
                                />
                                <Image source={wheelchair_access_icon} style={{width:40,marginBottom:10, height:40}}/>
                                    
                            </View>
                        </View>
                        <View style={boxStyles.boxTransparent}>
                            <Text style={boxStyles.CheckListHeader}>Checklist</Text>
                            <FlatList
                                data={trail_check_list}
                                keyExtractor={(item,index)=>item.id}
                                renderItem={({item})=><Text key={item.id} style={boxStyles.CheckListText}>{item.item}</Text>}
                                scrollEnabled={false}
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
                            style={styles_footer_trail.BtnImage}
                        />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles_footer_trail.ApplyBtn}
                    onPress={() => navigation.navigate("parking")}
                >
                <Text style={styles_footer_trail.ApplyBtnText}>Parking & TrailHead</Text>
                </TouchableOpacity>
            </View>
        </View>
)};

export default TrailOverviewTemplate;