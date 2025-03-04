import { View, Text , StyleSheet, TextInput, KeyboardAvoidingView, Dimensions, SafeAreaView } from 'react-native'
import {
    Alert,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
  } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Flashcard, SingleFlashcardProps } from '@/types/custom';
import GrayedOutOverlay from './GrayedOutOverlay';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView, Keyboard } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { transform } from '@babel/core';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SingleEditableFlashcard = (props : SingleFlashcardProps) => {
    const colorScheme = useColorScheme();
    const [flaschardQuestionText, setFlashcardQuestionText] = useState(props.flashcard.question);
    const [flaschardAnswerText, setFlaschardAnswerText] = useState(props.flashcard.answer);
    const [isEndFlashcard, setIsEndFlashcard] = useState(false);
    const scale = useSharedValue(screenHeight * 0.35);
    // const bottomPadding = useSharedValue(0);
    const scrollViewRef = useRef(null);

    
    const answerReanimatedStyle = useAnimatedStyle(() => {
        return {
            height: scale.value,
            
        };
    }, []);


    const rnAnimatedStyle = useAnimatedStyle(() => {
        return{
            transform: [
                {
                    translateX: interpolate(
                        props.scrollX.value,
                        [(props.flashcardIndex-1) * screenWidth, props.flashcardIndex * screenWidth, (props.flashcardIndex+1) * screenWidth],
                        [-screenWidth * 0.25, 0, screenWidth * 0.25],
                        Extrapolation.CLAMP
                    ),
                },
                {
                    scale: interpolate(
                        props.scrollX.value,
                        [(props.flashcardIndex-1) * screenWidth, props.flashcardIndex * screenWidth, (props.flashcardIndex+1) * screenWidth],
                        [0.9, 1, 0.9],
                        Extrapolation.CLAMP
                    )
                }
            ]
        }
    })


    useEffect(() => {
        props.flashcard.GUID === 0 ? setIsEndFlashcard(true) : setIsEndFlashcard(false);
        setFlashcardQuestionText(props.flashcard.question);
        setFlaschardAnswerText(props.flashcard.answer);

    }, [props.flashcard])

    useEffect(() => {
        props.handleFlashcardUpdate({
            GUID: props.flashcard.GUID,
            question: flaschardQuestionText,
            answer: flaschardAnswerText
        });
    }, [flaschardQuestionText, flaschardAnswerText])

    const handleAnswerFocus = () => {
        scale.value = withTiming(screenHeight * 0.9);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd();
        }, 200)
    }

    const handleAnswerBlur = () => {
        scale.value = withTiming(screenHeight * 0.35)
        
    }

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener(
    //         Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
    //         (event) => {
    //             bottomPadding.value = withTiming(event.endCoordinates.height);
    //         }
    //     );
    //     const keyboardDidHideListener = Keyboard.addListener(
    //         Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
    //         () => {
    //           bottomPadding.value = withTiming(0);
    //         }
    //       );

    //     return () => {
    //     keyboardDidShowListener.remove();
    //     keyboardDidHideListener.remove();
    //     };
    // }, []);

    return (
        <Animated.View style={[styles.container, rnAnimatedStyle]}>
            <Text>{props.flashcardIndex}</Text>
            <GrayedOutOverlay visible={isEndFlashcard} handleAddFlashcard={props.handleAddFlashcard}></GrayedOutOverlay>
            
            <ScrollView keyboardShouldPersistTaps='always' ref={scrollViewRef}>
                <View style={styles.questionBox}>
                    <Text style={styles.anotationText}>Question</Text>
                    <TextInput
                    multiline
                    style={styles.flashcardText}
                    onChangeText={setFlashcardQuestionText}
                    value={flaschardQuestionText}
                    >
                    </TextInput>
                </View>
                
                <Animated.View style={[styles.answerBox, answerReanimatedStyle]}>
                    <Text style={styles.anotationText}>Answer</Text>
                    <TextInput
                    multiline
                    style={styles.flashcardText}
                    onChangeText={setFlaschardAnswerText}
                    value={flaschardAnswerText}
                    onFocus={handleAnswerFocus}
                    onBlur={handleAnswerBlur}
                    >
                    </TextInput>
                </Animated.View>
                
                <TouchableHighlight
                    style={styles.removeButton}
                    onPress={() => props.handleDeleteFlashcard(props.flashcard.GUID)}
                    >
                        <AntDesign name="delete" size={24} color="black" />
                </TouchableHighlight>
                {/* <View style={{height: bottomPadding.value, width: 100, backgroundColor: 'green'}}>

                </View> */}
            </ScrollView>
            
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    questionBox: {
        borderRadius: 20,
        padding: 20,
        margin: 10,
        backgroundColor: 'orange',
        width: screenWidth * 0.7,
        height: screenHeight * 0.35,
    },
    answerBox: {
        borderRadius: 20,
        padding: 20,
        margin: 10,
        backgroundColor: 'orange',
        width: screenWidth * 0.7,
        height: screenHeight * 0.35,
    },
    flashcardText: {
        outlineStyle: 'none',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Courier New',
    },
    anotationText: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'Courier New',
    },
    removeButton: {
        flex: 1,
    }
})

export default SingleEditableFlashcard;