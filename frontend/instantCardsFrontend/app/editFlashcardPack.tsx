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
    
    const handleQuestionChange = (text) => {
        setFlashcardPack(prevFlashcardPack => ({
        ...prevFlashcardPack,
          flashcards: prevFlashcardPack.flashcards.map((flashcard, index) => 
            index === currentFlashcardIndex? {...flashcard, question: text }: flashcard
          )
        }));
      }
      
      const handleAnswerChange = (text) => {
        setFlashcardPack(prevFlashcardPack => ({
        ...prevFlashcardPack,
          flashcards: prevFlashcardPack.flashcards.map((flashcard, index) => 
            index === currentFlashcardIndex? {...flashcard, answer: text }: flashcard
          )
        }));
      }

    useEffect(() => {
        useSaveLocalFlashcardPack(flashcardPack);
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
            {/* <SingleEditableFlashcard flashcard={currentFlashcard} setCurrentFlashcard={setCurrentFlashcard}></SingleEditableFlashcard> */}

            <View style={styles.editingContainer}>
                            <TextInput
                            style={styles.questionBox}
                            onChangeText={handleQuestionChange}
                            value={flashcardPack.flashcards[currentFlashcardIndex].question}
                            >
                            </TextInput>
            
                            <TextInput
                            style={styles.answerBox}
                            onChangeText={handleAnswerChange}
                            value={flashcardPack.flashcards[currentFlashcardIndex].answer}
                            >
                            </TextInput>
                        </View>
                        
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
    },
    editingContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    questionBox: {
        width: '90%',
        height: '20%',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Courier New',
        backgroundColor: 'orange',
    },
    answerBox: {
        width: '90%',
        height: '20%',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Courier New',
        backgroundColor: 'orange',
    },
})

export default editFlashcardPack;