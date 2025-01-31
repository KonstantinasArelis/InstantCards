import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect} from 'react';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import { FlashcardPack, Flashcard } from '@/types/custom';
import SingleFlashcard from './SingleFlashcard';
import { View, Text , StyleSheet, TouchableHighlight, TextInput } from 'react-native'
import NextFlashcardButton from './NextFlashcardButton';
import PreviousFlashcardButton from './PreviousFlashcardButton';
import SingleEditableFlashcard from './SingleEditableFlashcard';
import useSaveLocalFlashcardPack from '@/hooks/useSaveLocalFlashcardPack';
import { FlatList } from 'react-native';
import uuid from 'react-native-uuid';

const editFlashcardPack = () => {
    const flashcardPackGUID = useLocalSearchParams<any>();
    const [flashcardPack, setFlashcardPack] = useState<FlashcardPack | null>(null);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);


    const isFlashcardPack = (data: FlashcardPack | Error) => {
        return !(data instanceof Error)
    }

    useEffect(() => {
        useFetchLocalFlashcardPack(flashcardPackGUID.GUID).then((result) => {
            if(isFlashcardPack(result)){
                const endFlashcard : Flashcard = {GUID: 0, question: 'add a question', answer: 'add an answer'};
                result.flashcards.push(endFlashcard);
                setFlashcardPack(result);
            } else {
                console.error("error has occured");
            }
        })
    }, [])



    const onPressNext = () => {
        if(!flashcardPack){
            return;
        }
        
        if(currentFlashcardIndex < flashcardPack.flashcards.length-1){
            const newIndex = currentFlashcardIndex + 1;
            setCurrentFlashcardIndex(newIndex);
        }
    }

    const onPressPrevious = () => {
        if(!flashcardPack){
            return;
        }

        if(currentFlashcardIndex > 0){
            const newIndex = currentFlashcardIndex - 1;
            setCurrentFlashcardIndex(newIndex);
        }
    }
    
    const handleFlashcardUpdate = (updatedFlashcard) => {
        setFlashcardPack(prevFlashcardPack => ({
            ...prevFlashcardPack,
              flashcards: prevFlashcardPack.flashcards.map((flashcard, index) => {
                if (flashcard.GUID === updatedFlashcard.GUID) {
                    return {...flashcard, question: updatedFlashcard.question, answer: updatedFlashcard.answer };
                } else {
                    return flashcard;
                }
              })
            }));
    }

    const handleAddFlashcard = () => {
        const newFlashcard : Flashcard= {
            GUID: uuid.v4(),
            question: 'Add a question',
            answer: 'Add an answer'
        };
        console.log(newFlashcard);
        setFlashcardPack(prevFlashcardPack => {
            const updatedFlashcardPack = JSON.parse(JSON.stringify(prevFlashcardPack)); 
        
            updatedFlashcardPack.flashcards.splice(updatedFlashcardPack.flashcards.length - 1, 0, newFlashcard);
            return updatedFlashcardPack; 
          });
    }

    const handleDeleteFlashcard = (flashcardGUID) => {
        setFlashcardPack(prevFlashcardPack => {
            let updatedFlashcardPack = JSON.parse(JSON.stringify(prevFlashcardPack)); 
            updatedFlashcardPack.flashcards = updatedFlashcardPack.flashcards.filter(flashcard => flashcard.GUID !== flashcardGUID)
            return updatedFlashcardPack; 
        });
    }

    useEffect(() => {
        if(flashcardPack!== null){
            const toSaveFlashcardPack = JSON.parse(JSON.stringify(flashcardPack));
            toSaveFlashcardPack.flashcards = toSaveFlashcardPack.flashcards.filter(flashcard => flashcard.GUID !== 0);
        useSaveLocalFlashcardPack(toSaveFlashcardPack);
        }
        
    }, [flashcardPack])

    if(!flashcardPack){
        return(
            <View>
                <Text>Loading...</Text>
            </View>
            
        )
    }

    return(
            <View style={styles.container}>
                <FlatList 
                style={styles.slidingContainer}
                data={flashcardPack.flashcards}
                renderItem={({ item }) => <SingleEditableFlashcard flashcard={item} handleFlashcardUpdate={handleFlashcardUpdate} handleAddFlashcard={handleAddFlashcard} handleDeleteFlashcard={handleDeleteFlashcard}/>}
                horizontal
                showsHorizontalScrollIndicator
                pagingEnabled
                >
                </FlatList>
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
    },
    slidingContainer: {
        
    }
})

export default editFlashcardPack;