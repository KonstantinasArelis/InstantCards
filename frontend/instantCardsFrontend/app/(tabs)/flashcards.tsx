import { View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';
import { Flashcard, FlashcardPack, FlashcardPackBasicInfoList } from '@/types/custom';
import useFetchLocalFlashcardPackBasicInfoList from '@/hooks/useFetchLocalFlashcardPackBasicInfoList';
import useSaveLocalFlashcardPack from '@/hooks/useSaveLocalFlashcardPack';
import useSaveLocalFlashcardPackBasicInfoList from '@/hooks/useSaveLocalFlashcardPackBasicInfoList';

const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';
    const [flashcardPackBasicInfoList, setFlashcardPackBasicInfoList] = useState<FlashcardPackBasicInfoList | null>(null);
    const [error, setError] = useState <Error | null>(null);

    const isFlashcardPackBasicInfoList = (data: FlashcardPackBasicInfoList | Error) => {
        return !(data instanceof Error)
    }
    const sampleFlashcard: Flashcard = {
        GUID: "123e4567-e89b-12d3-a456-426614174000",
        question: "What is the capital of France?",
        answer: "Paris"
    };
    
    const sampleFlashcard2: Flashcard = {
        GUID: "123e4567-e89b-12d3-a456-426614174001",
        question: "What is the highest mountain in the world?",
        answer: "Mount Everest"
    };
    
    const sampleFlashcardPack: FlashcardPack = {
        GUID: "890c1234-d56e-789f-a12b-345678901000",
        name: "Geography Quiz",
        flashcards: [sampleFlashcard, sampleFlashcard2]
    };

    const sampleFlashcardPackBasicInfoList: FlashcardPackBasicInfoList = [
        {
            GUID: "890c1234-d56e-789f-a12b-345678901000",
            name: "History Facts"
        }
    ];

    useEffect(() => {
        
        // useSaveLocalFlashcardPack(sampleFlashcardPack).then((result) => {
        //     console.log(result);
        // })

        useSaveLocalFlashcardPackBasicInfoList(sampleFlashcardPackBasicInfoList);

        useFetchLocalFlashcardPackBasicInfoList().then((result) => {
            if(isFlashcardPackBasicInfoList(result)){
                setFlashcardPackBasicInfoList(result);
            } else {
                console.error("error has occured");
            }
            
        })
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
                            params: { GUID: item.GUID}
                        }}
                        style={{marginHorizontal: 'auto'}}
                        asChild>
                            <Pressable>
                                <Text style={[styles.item, {color: color}]}>{item.name}</Text>
                            </Pressable>
                        </Link> 

                        <Link href={{
                            pathname: "/editFlashcardPack",
                            params: { GUID: item.GUID}
                        }}
                        style={{marginHorizontal: 'auto'}}
                        asChild>
                            <Pressable>
                                <Text style={[styles.item, {color: color}]}>Edit</Text>
                            </Pressable>
                        </Link> 
                    </View>
            }
            >
            </FlatList>
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
    }
})

export default flashcards;