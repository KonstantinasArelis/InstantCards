import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect} from 'react';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import { FlashcardPack, Flashcard } from '@/types/custom';
import { View, Text , StyleSheet } from 'react-native'
import SingleEditableFlashcard from './SingleEditableFlashcard';
import useSaveLocalFlashcardPack from '@/hooks/useSaveLocalFlashcardPack';
import uuid from 'react-native-uuid';
import { Dimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const editFlashcardPack = () => {
    const flashcardPackGUID = useLocalSearchParams<any>();
    const [flashcardPack, setFlashcardPack] = useState<FlashcardPack | null>(null);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
    const scrollX = useSharedValue(0);

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

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        }
    })

    if(!flashcardPack){
        return(
            <View>
                <Text>Loading...</Text>
            </View>
            
        )
    }

    return(
        <View style={styles.container}> 
            <Animated.FlatList 
            data={flashcardPack.flashcards}
            renderItem={({ item }) => 
                <SingleEditableFlashcard scrollX={scrollX} flashcard={item} flashcardIndex={flashcardPack.flashcards.indexOf(item)} handleFlashcardUpdate={handleFlashcardUpdate} handleAddFlashcard={handleAddFlashcard} handleDeleteFlashcard={handleDeleteFlashcard}/>
            }
            keyExtractor={item => item.GUID}
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            onScroll={onScrollHandler}
            >
            </Animated.FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

export default editFlashcardPack;