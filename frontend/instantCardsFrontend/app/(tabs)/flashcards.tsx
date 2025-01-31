import { View, Text, StyleSheet, FlatList, Pressable, TouchableHighlight} from 'react-native';

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


const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';
    const [flashcardPackBasicInfoList, setFlashcardPackBasicInfoList] = useState<FlashcardPackBasicInfoList | null>(null);
    const [error, setError] = useState <Error | null>(null);
    const navigation = useNavigation();
 

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
            <FlatList
            data={flashcardPackBasicInfoList}
            renderItem={
                ({item}) => 
                    <View>
                       <Link href={{
                            pathname: "/flashcardPlay",
                            params: { GUID: item.GUID},
                        }}
                        style={{marginHorizontal: 'auto'}}
                        asChild>
                            <Pressable>
                                <Text style={[styles.item, {color: color}]}>{item.name}</Text>
                            </Pressable>
                        </Link> 

                        <Link href={{
                            pathname: "/editFlashcardPack",
                            params: { GUID: item.GUID},
                        }}
                        style={{marginHorizontal: 'auto'}}
                        asChild>
                            <Pressable>
                                <Text style={[styles.item, {color: color}]}>Edit</Text>
                            </Pressable>
                        </Link> 
                        <TouchableHighlight
                        onPress={() => handleDeleteFlashcardPack(item.GUID)}
                        >
                            <Text style={{color: 'white'}}>Delete</Text>
                        </TouchableHighlight>
                    </View>
            }
            >
            </FlatList>
            <View style={styles.addFlashcardPackContainer}>
                <TouchableHighlight
                onPress={handleAddFlashcardPack}
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
    }
})

export default flashcards;