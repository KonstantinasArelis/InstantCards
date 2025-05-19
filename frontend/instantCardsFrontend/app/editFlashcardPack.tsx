import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect} from 'react';
import useFetchLocalFlashcardPack from "../hooks/useFetchLocalFlashcardPack";
import { FlashcardPack, Flashcard } from '@/types/custom';
import {View, Text, StyleSheet, TouchableHighlight, Modal, Pressable} from 'react-native'
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
    const [timelyOperationOptimisticLockModalVisible, setTimelyOperationOptimisticLockModalVisible] = useState<boolean>(false);
    const [flashcardPackUpdateOptimisticLockModalVisible, setFlashcardPackUpdateOptimisticLockModalVisible] = useState<boolean>(false);

    const loadFlashcardPack = () => {
        return fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/${flashcardPackid.id}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                data.flashcards.push(
                    {
                        fakeId: "LastCardPlaceHolder",
                        question: "DummyQuestion",
                        answer: "DummyAnswer",
                        version: 0
                    }
                )
                setFlashcardPack(data);
            })
            .catch(Error => {
                console.error(Error);
            })
    }

    useEffect(() => {
        loadFlashcardPack()
            .then(() => console.log("Loaded flashcardPack"))
    }, [])
    
    const handleFlashcardUpdate = (updatedFlashcard : Flashcard) => {
            setFlashcardPack((prevFlashcardPack : FlashcardPack | null) => {
                if(!prevFlashcardPack){
                    return null;
                }

                return {
                    ...prevFlashcardPack,
                    flashcards: prevFlashcardPack.flashcards.map((flashcard : Flashcard) => {
                        if(flashcard.fakeId === updatedFlashcard.fakeId){
                            return updatedFlashcard;
                        } else {
                            return flashcard;
                        }
                    })
                }
            })
    }

    const handleAddFlashcard = () => {
        const newFlashcard : Flashcard= {
            fakeId: uuid.v4(),
            question: 'Add a question',
            answer: 'Add an answer',
            version: 0
        };

        setFlashcardPack(prevFlashcardPack => {
            const updatedFlashcardPack = JSON.parse(JSON.stringify(prevFlashcardPack)); 
        
            updatedFlashcardPack.flashcards.splice(updatedFlashcardPack.flashcards.length - 1, 0, newFlashcard);
            return updatedFlashcardPack; 
          });
    }

    const handleDeleteFlashcard = (flashcardFakeId : string) => {
        setFlashcardPack((prevFlashcardPack: FlashcardPack | null) => {
            let updatedFlashcardPack = JSON.parse(JSON.stringify(prevFlashcardPack)); 
            updatedFlashcardPack.flashcards = updatedFlashcardPack.flashcards.filter((flashcard : Flashcard) => flashcard.fakeId !== flashcardFakeId)
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

    const handleSaveFlashcardPack = (force : boolean = false) => {
        if(!flashcardPack){
            return;
        }
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/update/${flashcardPackid.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                    ...flashcardPack,
                    flashcards:
                        flashcardPack.flashcards
                            .filter((flashcard: Flashcard) => {
                                return flashcard.fakeId != "LastCardPlaceHolder";
                            }).map((flashcard : Flashcard) => {
                                return {
                                    ...flashcard, force: force
                                }
                            })
                    })
        })
            .then(response => {
                if(response.status == 409){
                    setFlashcardPackUpdateOptimisticLockModalVisible(true);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                loadFlashcardPack();
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

    const handlePerformTimelyOperation = () => {
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/timelyOperation/${flashcardPackid.id}`, {
            method: 'PUT'
        })
            .then(response => {
                if(response.status === 409){
                    setTimelyOperationOptimisticLockModalVisible(true);
                } else if(response.ok){
                    loadFlashcardPack();
                }
        })
        .catch(error => {
            console.error(error);
        })
    }

    const handleOverwriteTimelyOperationChanges = () => {
        setTimelyOperationOptimisticLockModalVisible(false)
        fetch(`http://localhost:8080/backend-1.0-SNAPSHOT/api/flashcardPack/timelyOperation/force/${flashcardPackid.id}`, {
            method: 'PUT'
        })
            .then(response => {
                if(response.status === 409){
                    setTimelyOperationOptimisticLockModalVisible(true);
                } else if(response.ok){
                    loadFlashcardPack();
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleOverwriteFlashcardPackChanges = () => {

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
            <Modal
                animationType="slide"
                transparent={true}
                visible={timelyOperationOptimisticLockModalVisible}
                onRequestClose={() => {
                    setTimelyOperationOptimisticLockModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>The flashcard you are trying to change was modified by someone else.</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleOverwriteTimelyOperationChanges}>
                            <Text style={styles.textStyle}>Overwrite changes</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setTimelyOperationOptimisticLockModalVisible(false)
                                loadFlashcardPack();
                            }}>
                            <Text style={styles.textStyle}>Update to current version</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={flashcardPackUpdateOptimisticLockModalVisible}
                onRequestClose={() => {
                    setFlashcardPackUpdateOptimisticLockModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>The flashcard you are trying to change was modified by someone else.</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleSaveFlashcardPack(true)}>
                            <Text style={styles.textStyle}>Overwrite changes</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setFlashcardPackUpdateOptimisticLockModalVisible(false)
                                loadFlashcardPack();
                            }}>
                            <Text style={styles.textStyle}>Update to current version</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Animated.FlatList 
            data={flashcardPack.flashcards}
            renderItem={({ item }) => 
                <SingleEditableFlashcard scrollX={scrollX} flashcard={item} flashcardIndex={flashcardPack.flashcards.indexOf(item)} handleFlashcardUpdate={handleFlashcardUpdate} handleAddFlashcard={handleAddFlashcard} handleDeleteFlashcard={handleDeleteFlashcard}/>
            }
            keyExtractor={item => item.fakeId}
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            onScroll={onScrollHandler}
            >
            </Animated.FlatList>
            <View style={styles.buttonContainer}>
                <TouchableHighlight onPress={() => handleSaveFlashcardPack()}>
                    <View style={styles.SaveButton}>
                        <Text>Save Flashcard Pack</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={handleDeleteFlashcardPack}>
                    <View style={styles.DeleteButton}>
                        <Text>Delete Flashcard Pack</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={handlePerformTimelyOperation}>
                    <View style={styles.TimelyOperationButton}>
                        <Text>Perform timely operation</Text>
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
    },
    TimelyOperationButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
        marginRight: 20,
        marginBottom: 5,
        padding: 5,
        borderRadius: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
})

export default editFlashcardPack;