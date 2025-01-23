import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect} from 'react';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import { FlashcardPack, Flashcard } from '@/types/custom';
import SingleFlashcard from './SingleFlashcard';
import { View, Text , StyleSheet, TouchableHighlight } from 'react-native'

const editFlashcardPack = () => {
    const flashcardPackGUID = useLocalSearchParams<any>();
    const [flashcardPack, setFlashcardPack] = useState<FlashcardPack | null>(null);
    const [flashcard, setFlashcard] = useState<Flashcard | null>(null);

    useEffect(() => {
        useFetchLocalFlashcardPack(flashcardPackGUID).then((result) => {
            setFlashcardPack(result);
        })
    }, [])

    useEffect(() => {
        if(flashcardPack !== null){
            setFlashcard(flashcardPack.flashcards[0])
        }
    }, [flashcardPack])

    if(!flashcardPack || !flashcard){
        return(
            <View>
                <Text>Loading...</Text>
            </View>
            
        )
    }

    return(
        <SingleFlashcard flashcard={flashcard}></SingleFlashcard>
    )

}

export default editFlashcardPack;