import { View, Text , StyleSheet, TouchableHighlight } from 'react-native'
import { Link, useRouter} from 'expo-router'
import SingleFlashcard from './SingleFlashcard'
import { useLocalSearchParams } from 'expo-router';
import { flashcardPack } from '@/constants/sampleData';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Flashcard, FlashcardPack, FlashcardPackGUID, FlashcardPackGUIDFromRoute } from '@/types/custom';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import NextFlashcardButton from './NextFlashcardButton';
import PreviousFlashcardButton from './PreviousFlashcardButton';

const flashcardPlay = () => {
    const flashcardPackGUID = useLocalSearchParams< any>();
    const colorScheme = useColorScheme();
    const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [flashcardPack, setFlashcardPack] = useState<FlashcardPack | null>(null);

    const isFlashcardPack = (data: FlashcardPack | Error) => {
        return !(data instanceof Error)
    }

    useEffect(() => {
        useFetchLocalFlashcardPack(flashcardPackGUID.GUID).then( result => {
            if(isFlashcardPack(result)){
                setFlashcardPack(result);
            } else {
                console.error("error has occured: " + result);
            }
        })
    },[])
        
    useEffect(() => {
        if(flashcardPack !== null){
            setCurrentFlashcard(flashcardPack.flashcards[0]);
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
        return (
            <Text>Loading...</Text>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.buttonText, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}> {currentFlashcardIndex+1} out of {flashcardPack.flashcards.length}</Text>
            <SingleFlashcard flashcard={currentFlashcard}>
            
            </SingleFlashcard>
            <View style={styles.controls}>
                <View style={styles.buttons}>
                    <PreviousFlashcardButton handlePrevious={onPressPrevious}></PreviousFlashcardButton>
                    <NextFlashcardButton handleNext={onPressNext}></NextFlashcardButton>
                    
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

export default flashcardPlay;