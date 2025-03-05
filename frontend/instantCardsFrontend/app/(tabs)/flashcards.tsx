import { View, Text, StyleSheet, FlatList, Pressable, TouchableHighlight, Dimensions, TouchableWithoutFeedback} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';
import { Flashcard, FlashcardPack, FlashcardPackBasicInfoList } from '@/types/custom';
import useFetchLocalFlashcardPackBasicInfoList from '@/hooks/useFetchLocalFlashcardPackBasicInfoList';
import useSaveLocalFlashcardPack from '@/hooks/useSaveLocalFlashcardPack';
import useSaveLocalFlashcardPackBasicInfoList from '@/hooks/useSaveLocalFlashcardPackBasicInfoList';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from 'expo-router';
import useRemoveLocalFlashcardPack from '@/hooks/useRemoveLocalFlashcardPack';
import uuid from 'react-native-uuid';
import * as ImagePicker from "expo-image-picker";
import FlashcardPackIcon from '../FlashcardPackIcon';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';
    const [flashcardPackBasicInfoList, setFlashcardPackBasicInfoList] = useState<FlashcardPackBasicInfoList | null>(null);
    const [error, setError] = useState <Error | null>(null);
    const navigation = useNavigation();
    const [image, setImage] = useState();
    const [uploadOptions, SetUploadOptions] = useState(false);
    const showUploadOptions = () => SetUploadOptions(true);
    const hideUploadOptions = () => SetUploadOptions(false);

    const isFlashcardPackBasicInfoList = (data: FlashcardPackBasicInfoList | Error) => {
        return !(data instanceof Error)
    }

    const handleAddFlashcardPack = () => {
        const newFlashcardPack : FlashcardPack = {
            GUID: uuid.v4(),
            name: 'new pack',
            flashcards: []
        }
        useSaveLocalFlashcardPack(newFlashcardPack).then(() => {
            useFetchLocalFlashcardPackBasicInfoList().then(result => {
            console.log(result);
            
            result.push({
            GUID: newFlashcardPack.GUID,
            name: newFlashcardPack.name
            })
            useSaveLocalFlashcardPackBasicInfoList(result).then(() => {
                setFlashcardPackBasicInfoList(result);
            });
            })
        })
    }

    const handleDeleteFlashcardPack = (flashcardPackGuid) => {
        useRemoveLocalFlashcardPack(flashcardPackGuid).then(() => {
            useFetchLocalFlashcardPackBasicInfoList().then(result => {
                console.log(result);
                result = result.filter(item => item.GUID !== flashcardPackGuid);
                useSaveLocalFlashcardPackBasicInfoList(result).then(() => {
                    setFlashcardPackBasicInfoList(result);
                })
                })
        })
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
        } catch(error) {
            throw error;
        }
    }

    useEffect(() => {
        console.log('test1');
        //useSaveLocalFlashcardPackBasicInfoList(sampleFlashcardPackBasicInfoList);

        useFetchLocalFlashcardPackBasicInfoList().then((result) => {
            if(isFlashcardPackBasicInfoList(result)){
                setFlashcardPackBasicInfoList(result);
            } else {
                console.error("error has occured");
            }
            
        })
        console.log('test1 end');
    }, [])


    if (!flashcardPackBasicInfoList) { 
        return <Text>Loading...</Text>;
    }

    return (
            <View style={styles.container}>
                {uploadOptions && (
                <View style={styles.popupOverlay}>
                    <TouchableWithoutFeedback onPress={hideUploadOptions}>
                        <View style={styles.popupBackground}>

                        </View>
                    </TouchableWithoutFeedback>
                    
                    <View style={styles.centeringContainer}>
                        <View style={styles.uploadOptionsMenu}>
                            <TouchableWithoutFeedback
                            onPress={handleAddFlashcardPack}
                            >
                                <AntDesign style={styles.uploadOptionsItem} name="camerao" size={screenWidth * 0.15} color="black" />
                            </TouchableWithoutFeedback>
                            
                            <AntDesign style={styles.uploadOptionsItem} name="upload" size={screenWidth * 0.15} color="black" />
                        </View> 
                    </View> 
                    
                    
                </View> 
                )}
            
            <FlatList
            data={flashcardPackBasicInfoList}
            renderItem={
                ({item}) => 
                    <FlashcardPackIcon item={item} handleDeleteFlashcardPack={handleDeleteFlashcardPack}>

                    </FlashcardPackIcon>
            }
            >
            </FlatList>
            <View style={styles.addFlashcardPackContainer}>
                <TouchableHighlight
                onPress={showUploadOptions}
                >
                    <AntDesign name="plus" size={50} color="white" /> 
                    
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

})

export default flashcards;