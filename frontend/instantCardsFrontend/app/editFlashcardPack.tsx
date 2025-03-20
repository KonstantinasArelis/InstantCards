import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect} from 'react';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import { FlashcardPack, Flashcard } from '@/types/custom';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import SingleEditableFlashcard from './SingleEditableFlashcard';
import useSaveLocalFlashcardPack from '@/hooks/useSaveLocalFlashcardPack';
import uuid from 'react-native-uuid';
import { Dimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const editFlashcardPack = () => {
    const flashcardPackid = useLocalSearchParams<any>();
    const [flashcardPack, setFlashcardPack] = useState<FlashcardPack | null>(null);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
    const scrollX = useSharedValue(0);

    useEffect(() => {
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/${flashcardPackid.id}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                data.flashcards.push(
                    {
                        question: "DummyQuestion",
                        answer: "DummyAnswer"
                    }
                )
                setFlashcardPack(data);
            })
            .catch(Error => {
                console.error(Error);
        })

    }, [])
    
    const handleFlashcardUpdate = (updatedFlashcard) => {
        setFlashcardPack(prevFlashcardPack => ({
            ...prevFlashcardPack,
              flashcards: prevFlashcardPack.flashcards.map((flashcard, index) => {
                if (flashcard.id === updatedFlashcard.id) {
                    return {...flashcard, question: updatedFlashcard.question, answer: updatedFlashcard.answer };
                } else {
                    return flashcard;
                }
              })
            }));
    }

    const handleAddFlashcard = () => {
        const newFlashcard : Flashcard= {
            id: 10000,
            question: 'Add a questiontest',
            answer: 'Add an answertest'
        };
        setFlashcardPack(prevFlashcardPack => {
            const updatedFlashcardPack = JSON.parse(JSON.stringify(prevFlashcardPack)); 
        
            updatedFlashcardPack.flashcards.splice(updatedFlashcardPack.flashcards.length - 1, 0, newFlashcard);
            return updatedFlashcardPack; 
          });
    }

    const handleDeleteFlashcard = (flashcardid) => {
        setFlashcardPack(prevFlashcardPack => {
            let updatedFlashcardPack = JSON.parse(JSON.stringify(prevFlashcardPack)); 
            updatedFlashcardPack.flashcards = updatedFlashcardPack.flashcards.filter(flashcard => flashcard.id !== flashcardid)
            return updatedFlashcardPack; 
        });
    }

    useEffect(() => {
        // if(flashcardPack!== null){
        //     const toSaveFlashcardPack = JSON.parse(JSON.stringify(flashcardPack));
        //     toSaveFlashcardPack.flashcards = toSaveFlashcardPack.flashcards.filter(flashcard => flashcard.GUID !== 0);
        // useSaveLocalFlashcardPack(toSaveFlashcardPack);
        // }
        
    }, [flashcardPack])

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        }
    })

    const handleSaveFlashcardPack = () => {
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/update/${flashcardPackid.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flashcardPack)
        })
            .then(response => {
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleDeleteFlashcardPack = () => {
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/delete/${flashcardPackid.id}`, {
            method: 'DELETE'
        })
            .then(() => {
                router.back();
            })
    }

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
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            onScroll={onScrollHandler}
            >
            </Animated.FlatList>
            <View style={styles.buttonContainer}>
                <TouchableHighlight onPress={handleSaveFlashcardPack}>
                    <View style={styles.SaveButton}>
                        <Text>Save Flashcard Pack</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={handleDeleteFlashcardPack}>
                    <View style={styles.DeleteButton}>
                        <Text>Delete Flashcard Pack</Text>
                    </View>
                </TouchableHighlight>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    SaveButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        marginRight: 20,
        marginBottom: 5,
        padding: 5,
        borderRadius: 5
    },
    DeleteButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        marginRight: 20,
        marginBottom: 5,
        padding: 5,
        borderRadius: 5
    }
})

export default editFlashcardPack;