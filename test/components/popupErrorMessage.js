import React from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PopupErrorMessage({
    error_message,
    modalVisible,
    setModalVisible
}){
    const styles = StyleSheet.create({
        centeredView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22,
        },
        modalView: {
          margin: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        button: {
          borderRadius: 20,
          padding: 10,
          elevation: 2,
        },
        buttonOpen: {
          backgroundColor: '#F194FF',
        },
        buttonClose: {
          backgroundColor: '#2196F3',
        },
        textStyle: {
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        modalText: {
          marginBottom: 15,
          textAlign: 'center',
        },
      });
    return(
        <View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('modal closed');
                    setModalVisible(!modalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Error</Text>
                        <Text style={styles.modalText}>{error_message}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={()=>setModalVisible(!modalVisible)}
                        >
                            <Text styles={styles.textStyle}>
                                Close
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}