import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    TouchableHighlight,
    Dimensions,
    TouchableWithoutFeedback,
    Pressable
} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import {useCallback, useEffect, useState} from 'react';
import { Flashcard, FlashcardPack, FlashcardPackBasicInfoList } from '@/types/custom';
import useFetchLocalFlashcardPackBasicInfoList from '@/hooks/useFetchLocalFlashcardPackBasicInfoList';
import useSaveLocalFlashcardPack from '@/hooks/useSaveLocalFlashcardPack';
import useSaveLocalFlashcardPackBasicInfoList from '@/hooks/useSaveLocalFlashcardPackBasicInfoList';
import AntDesign from '@expo/vector-icons/AntDesign';
import {useFocusEffect, useNavigation} from 'expo-router';
import useRemoveLocalFlashcardPack from '@/hooks/useRemoveLocalFlashcardPack';
import uuid from 'react-native-uuid';
import * as ImagePicker from "expo-image-picker";
import FlashcardPackIcon from '../FlashcardPackIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';
    const [flashcardPackBasicInfoList, setFlashcardPackBasicInfoList] = useState<FlashcardPackBasicInfoList | null>(null);
    
    const navigation = useNavigation();
    const [image, setImage] = useState();
    const [uploadOptions, SetUploadOptions] = useState(false);
    const showUploadOptions = () => SetUploadOptions(true);
    const hideUploadOptions = () => SetUploadOptions(false);
    const [waitingForResponse, SetWaitingForResponse] = useState(false);
    const [response, SetResponse] = useState(null);
    const [errorGettingImageData, SetErrorGettingImageData] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [flashcardCount, setFlashcardCount] = useState("");

    useEffect( () => {
        SetErrorGettingImageData(false);
    }, [uploadOptions])

    const handleAddFlashcardPack = () => {
        const newFlashcardPack : FlashcardPack = {
            name: 'new pack',
            flashcards: []
        }
        fetch("http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFlashcardPack),
        }).then(response => response.json())
            .then(data => {
                console.log("response: " + data);
                fetchFlaschardPackList();
            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleDeleteFlashcardPack = (flashcardPackGuid) => {
        // Implement once endpoint is added
    }

    const uploadImage = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                aspect: [1,1],
                quality: 1,
            });

        if(!result.canceled) {
            await saveImage(result.assets[0].uri);
        }
        } catch (error) {
            alert("Error uploading image: " + error.message);
        }
    };

    const saveImage = async (image) => {
        try {
            setImage(image);
            SetWaitingForResponse(true);
            setTimeout( () => {
                fetch("http://192.168.1.107:8080/backend-1.0-SNAPSHOT/api/hello-world", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    image_base64: image,
                    }),
                    
                })
                .then(response => {
                    if(!response.ok) {
                        console.log("error when getting the response from api 1");
                        
                        SetErrorGettingImageData(true);
                    } else {
                        return response.json();
                    }
                }).then (responseData => {
                    SetResponse(responseData);
                    //handleAddFlashcardPackPreMade(responseData);
                    SetWaitingForResponse(false);
                }).catch(err => {
                    console.log(response);
                    console.log("error when getting the response from api 2");
                    console.log(err);
                    SetErrorGettingImageData(true);
                    SetWaitingForResponse(false);
                })
            }, 2000)
            
        } catch(error) {
            throw error;
        }
    }

    const fetchFlaschardPackList = () => {
        fetch("http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardList/getList")
            .then(response => {
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("test: " + data.length);
                data.items.push({
                    id: "10000",
                    name: "Add new pack"
                })
                setFlashcardPackBasicInfoList(data.items);

            })
            .catch(error => {
                console.error(error);
            })
    }

    const fetchFlashcardCount = () => {
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/calculateCards`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                setFlashcardCount(data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    // when component is mounted
    useEffect(() => {
        fetchFlaschardPackList();
    }, [])

    // when component is focused (Ex. navigating back from editing flashcards)
    useFocusEffect(
        useCallback(() => {
            fetchFlaschardPackList();

            return () => {
                // do smth when screen is unfocused
            }
        }, [])
    )

    if (!flashcardPackBasicInfoList) { 
        return <Text>Loading...</Text>;
    }

    return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{flashcardCount}</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    setFlashcardCount("Loading...");
                                }}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable
                onPress={() => {
                    fetchFlashcardCount();
                    setModalVisible(true);
                }}
                >
                    <Text>Count all flashcards</Text>
                </Pressable>
                {uploadOptions && (
                <View style={styles.popupOverlay}>
                    <TouchableWithoutFeedback onPress={hideUploadOptions}>
                        <View style={styles.popupBackground}>

                        </View>
                    </TouchableWithoutFeedback>
                    
                    <View style={styles.centeringContainer}>
                        
                            {waitingForResponse && (
                                <View style={styles.uploadOptionsMenu}>
                                    <AntDesign style={styles.uploadOptionsItem} name="loading1" size={screenWidth * 0.15} color="black" />
                                </View> 
                            )}
                            {!waitingForResponse && !errorGettingImageData && (
                                <View style={styles.uploadOptionsMenu}>
                                    <TouchableWithoutFeedback
                                    onPress={handleAddFlashcardPack}
                                    >
                                        <AntDesign style={styles.uploadOptionsItem} name="camerao" size={screenWidth * 0.15} color="black" />
                                    </TouchableWithoutFeedback>
                                    
                                    <AntDesign style={styles.uploadOptionsItem} name="upload" size={screenWidth * 0.15} color="black" />
                                </View>
                            )}
                            {errorGettingImageData && (
                                <View style={styles.uploadOptionsMenu}>
                                    <MaterialIcons style={styles.uploadOptionsItem} name="error" size={screenWidth * 0.15} color="black" />
                                </View>
                            )}
                    </View> 
                </View> 
                )}
            
            <FlatList
            data={flashcardPackBasicInfoList}
            renderItem={
                ({item}) => 
                    <FlashcardPackIcon item={item} handleAddFlashcardPack={handleAddFlashcardPack} handleDeleteFlashcardPack={handleDeleteFlashcardPack} >

                    </FlashcardPackIcon>
            }
            >
            </FlatList>
            
            <View style={styles.addFlashcardPackContainer}>
                
                <TouchableHighlight
                onPress={handleAddFlashcardPack}
                >
                    <AntDesign name="plus" size={500} color="black" />
                    
                </TouchableHighlight>
            </View>
            
        </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        padding: 10,
        fontSize: 33,
        height: 44,
    },
    addFlashcardPackContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    greyOverlay: {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    uploadOptionsMenu: {
        zIndex: 101,
        backgroundColor: 'white',
        width: screenWidth * 0.85,
        height: screenHeight * 0.2,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centeringContainer: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadOptionsItem: {
        margin: screenWidth * 0.1,
    },
    popupOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupBackground: {
        position: 'absolute', // Background covers the whole overlay
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Greyed-out color (adjust opacity as needed)
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
})

export default flashcards;