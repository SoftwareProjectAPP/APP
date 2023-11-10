import * as Speech from 'expo-speech';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { get_checklist_for_trail, get_trail_by_id } from '../constants/database';

import { VARIABLES } from '../constants/config';

const TrailOverviewTemplate = ({navigation}) => {
    const [description, setDescription] = React.useState('TBD');
    const [image_url, setImageURL] = React.useState('TBD');
    const [mileage, setMileage] = React.useState('');
    const [rating, setRating] = React.useState('');
    const [trail_check_list, setTrailCheckList] = React.useState([]);

    const speak = () => {
        const Voice = 'Audio from database';
        Speech.speak(Voice);
    }

    const get_trail_data = async () =>{
        const t = await get_trail_by_id(VARIABLES.trail_id);

        console.log("t=");
        console.log(t);

        if(t.success === false){
            throw new Error(t.error);
        }else{
            console.log("trail_data = ")
            console.log(t.data[0]);

            const trail_data = t.data[0];

            setDescription(trail_data.description);
            setImageURL(trail_data.image_URL);
            setMileage(trail_data.mileage);
            setRating(trail_data.rating);
            //setAudioURL(trail_data.audio_URL);
            //setIsWheelChairAccessible(trail_data.is_wheelchair_accessible);
            const trail_name = trail_data.name;
            navigation.setOptions({headerTitle: trail_name});

            const t2 = await get_checklist_for_trail(VARIABLES.trail_id);
            if(t2.success === false){
                throw new Error(t2.error);
            }else{
                console.log("trail_check_list = ");
                console.log(t2.data);
                setTrailCheckList(t2.data);
            }
        }
    }

    React.useEffect(()=>{
        get_trail_data();
    }, []);

    const boxStyles = StyleSheet.create({
        container: {
            flex: 1,
        },
        boxContainer: {
            width: '100%',
            height: '85%',
            padding: 5,
            flexdirection:'row',
            flexWrap: 'wrap'
        },
        box: {
            width: '50%',
            height: '50%',
            padding: 5,
            backgroundColor: 'green',
        },
        boxTransparent: {
            width: '50%',
            height: '50%',
            padding: 5,
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
        DescriptionText:
        {
            textAlign: 'left',
            justifyContent: 'center',
            fontSize: 12,
            padding: 2,
            //textAlignmentsVertical: 'top'
        },
        CheckListText:
        {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 12,
            padding: 2,
            //textAlignmentsVertical: 'top'
        },
        CheckListHeader:
        {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 2,
            //textAlignmentsVertical: 'top'
        }
    });

    return(
        <View style={{height:'100%'}}>
                <View >
                    <View>
                        <View>
                            <Image
                                source ={require('../assets/images/Image.jpg')}
                                resizeMode='cover'
                                style={{width: 400, height: 150, }}
                            />
                        </View>
                        <Text>{image_url}</Text>
                        <View style = {{width: 400, height: 20, }} >
                        </View>
            
                
            <View style={boxStyles.boxContainer}>
                <View style={boxStyles.boxTransparent}>
                <Text style={boxStyles.DescriptionText}>
                    {description}
                </Text>
                </View>

                <View style={boxStyles.boxTransparent}>
                    <Image
                        source ={require('../assets/images/Image.jpg')}
                        resizeMode='cover'
                        style={{width: '100%', height: '100%', }}
                    />
                    <Text>{image_url}</Text>
                </View>

                <View style={boxStyles.box}>
                    <View style={boxStyles.innerSmall}>
                        <Text style={boxStyles.Mileagetext}>Mileage: {mileage} </Text>
                        <View style = {{width:'100%', height: 50}}/>
                        <Text style={boxStyles.Ratingtext}>Rating: {rating} </Text>
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
    </View>
</View>
)
};

export default TrailOverviewTemplate;