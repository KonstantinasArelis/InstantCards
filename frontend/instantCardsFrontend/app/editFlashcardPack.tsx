import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect} from 'react';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import { FlashcardPack, Flashcard } from '@/types/custom';
import SingleFlashcard from './SingleFlashcard';
import { View, Text , StyleSheet, TouchableHighlight } from 'react-native'
import NextFlashcardButton from './NextFlashcardButton';
import PreviousFlashcardButton from './PreviousFlashcardButton';
import SingleEditableFlashcard from './SingleEditableFlashcard';
const editFlashcardPack = () => {
    const flashcardPackGUID = useLocalSearchParams<any>();
    const [flashcardPack, setFlashcardPack] = useState<FlashcardPack | null>(null);
    const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

    const isFlashcardPack = (data: FlashcardPack | Error) => {
        return !(data instanceof Error)
    }

    useEffect(() => {
        useFetchLocalFlashcardPack(flashcardPackGUID).then((result) => {
            if(isFlashcardPack(result)){
                setFlashcardPack(result);
            } else {
                console.error("error has occured");
            }
        })
    }, [])

    useEffect(() => {
        if(flashcardPack !== null){
            setCurrentFlashcard(flashcardPack.flashcards[0])
        }
    }, [flashcardPack])

    const onPressNext = () => {
        if(!flashcardPack){
            return;
        }
        
        if(currentFlashcardIndex < flashcardPack.flashcards.length-1){
            const newIndex = currentFlashcardIndex + 1;
            setCurrentFlashcardIndex(newIndex);
            setCurrentFlashcard(flashcardPack.flashcards[newIndex]);
        }
    }

    const onPressPrevious = () => {
        if(!flashcardPack){
            return;
        }

        if(currentFlashcardIndex > 0){
            const newIndex = currentFlashcardIndex - 1;
            setCurrentFlashcardIndex(newIndex);
            setCurrentFlashcard(flashcardPack.flashcards[newIndex]);
        }
    
    }
    
    if(!flashcardPack || !currentFlashcard){
        return(
            <View>
                <Text>Loading...</Text>
            </View>
            
        )
    }

    return(
        <View style={styles.container}>
            <SingleEditableFlashcard flashcard={currentFlashcard}></SingleEditableFlashcard>
            <View style={styles.controls}>
                <View style={styles.buttons}>
                    <PreviousFlashcardButton handlePrevious={onPressPrevious}></PreviousFlashcardButton>
                    <NextFlashcardButton handleNext={onPressNext} ></NextFlashcardButton>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    controls: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nextButton: {
        width: 100,
        height: 40,
        margin: 10,
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
    }
})

export default editFlashcardPack;