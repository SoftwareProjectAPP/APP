import * as Speech from 'expo-speech';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { get_checklist_for_trail, get_trail_by_id } from '../constants/database';

import { VARIABLES } from '../constants/config';

// TODO: fix and test scren completely

const TrailOverviewTemplate = ({navigation}) => {
    const [description, onChangeDescription] = React.useState('TBD');
    const [image_url, onChangeImageURL] = React.useState('TBD');
    const [mileage, onChangeMileage] = React.useState(0.0);
    const [rating, onChangeRating] = React.useState(0);
    const [trail_check_list, onChangeTrailCheckList] = React.useState([]);

    const speak = () => {
        const Voice = 'Audio from database';
        Speech.speak(Voice);
    }

    const get_trail_data = async () =>{
        const res = get_trail_by_id(VARIABLES.trail_id);
        if(res.success === true)
        {
            console.log(res.data);
            const res2 = get_checklist_for_trail(VARIABLES.trail_id);
            if(res2.success === true)
            {
                // navigation.setOptions({title: trail_title});
                // onChangeTrailCheckList(trail_check_list);
                console.log(res2.data);
            }else{
                throw new Error(res.error);
            }
        }
        else{
            throw new Error(res.error);
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
            textAlignmentsVertical: 'top'
        },
        Ratingtext: {
            textAlign: 'left',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            textAlignmentsVertical: 'bottom'
        },
        DescriptionText:
        {
            textAlign: 'left',
            justifyContent: 'center',
            fontSize: 12,
            padding: 2,
            textAlignmentsVertical: 'top'
        },
        CheckListText:
        {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 12,
            padding: 2,
            textAlignmentsVertical: 'top'
        },
        CheckListHeader:
        {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 2,
            textAlignmentsVertical: 'top'
        }
    });

    return(
        <View style={{height:'100%'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View >
                    <View>
                        <View>
                            <Image
                                source ={require('../assets/images/Image.jpg')}
                                resizeMode='cover'
                                style={{width: 400, height: 150, }}
                            />
                        </View>
                        {image_url}
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
                    {image_url}
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
</ScrollView>
</View>
)
};

export default TrailOverviewTemplate;