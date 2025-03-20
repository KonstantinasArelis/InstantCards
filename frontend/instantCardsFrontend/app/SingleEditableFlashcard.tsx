import { View, Text , StyleSheet, TextInput, KeyboardAvoidingView, Dimensions, SafeAreaView, PanResponder, findNodeHandle } from 'react-native'
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TAP_THRESHOLD = 5; // Adjust this value to fine-tune tap vs swipe sensitivity

const SingleEditableFlashcard = (props : SingleFlashcardProps) => {
    const colorScheme = useColorScheme();
    const [flaschardQuestionText, setFlashcardQuestionText] = useState(props.flashcard.question);
    const [flaschardAnswerText, setFlaschardAnswerText] = useState(props.flashcard.answer);
    const [isEndFlashcard, setIsEndFlashcard] = useState(false);
    const scale = useSharedValue(screenHeight * 0.35);
    const scrollViewRef = useRef(null);
    const questionTextInputRef = useRef(null);
    const answerTextInputRef = useRef(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const containerRef = useRef(null);


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
        props.flashcard.question === "DummyQuestion" ? setIsEndFlashcard(true) : setIsEndFlashcard(false);
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


    return (
        <Animated.View
            style={[styles.container, rnAnimatedStyle]}
        >
            <Text>{props.flashcardIndex}</Text>
            <GrayedOutOverlay visible={isEndFlashcard} handleAddFlashcard={props.handleAddFlashcard}></GrayedOutOverlay>

            <ScrollView  ref={scrollViewRef} bounces={false} >
                <View
                    style={styles.questionBox}
                >
                    <Text style={styles.anotationText}>Question</Text>
                    <TextInput
                    ref={questionTextInputRef}
                    multiline
                    style={styles.flashcardText}
                    onChangeText={setFlashcardQuestionText}
                    value={flaschardQuestionText}
                    />
                </View>

                <Animated.View
                    style={[styles.answerBox, answerReanimatedStyle]}
                >
                    <Text style={styles.anotationText}>Answer</Text>
                    <TextInput
                    ref={answerTextInputRef}
                    multiline
                    style={styles.flashcardText}
                    onChangeText={setFlaschardAnswerText}
                    value={flaschardAnswerText}
                    onFocus={handleAnswerFocus}
                    onBlur={handleAnswerBlur}
                    />
                </Animated.View>

                <TouchableHighlight
                    style={styles.removeButton}
                    onPress={() => props.handleDeleteFlashcard(props.flashcard.GUID)}
                    >
                        <AntDesign name="delete" size={24} color="white" />
                </TouchableHighlight>
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
        flex: 1
    },
    anotationText: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'Courier New',
    },
    removeButton: {
        alignItems: 'center'
    }
})

export default SingleEditableFlashcard;