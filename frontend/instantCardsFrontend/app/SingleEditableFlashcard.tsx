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
import { useState, useEffect } from 'react';
import { Flashcard, SingleFlashcardProps } from '@/types/custom';
import GrayedOutOverlay from './GrayedOutOverlay';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SingleEditableFlashcard = (props : SingleFlashcardProps) => {
    const colorScheme = useColorScheme();
    const [flaschardQuestionText, setFlashcardQuestionText] = useState(props.flashcard.question);
    const [flaschardAnswerText, setFlaschardAnswerText] = useState(props.flashcard.answer);
    const [isEndFlashcard, setIsEndFlashcard] = useState(false);
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

    

    return (
        <Animated.View style={[styles.container, rnAnimatedStyle]}>
            <Text>{props.flashcardIndex}</Text>
            <GrayedOutOverlay visible={isEndFlashcard} handleAddFlashcard={props.handleAddFlashcard}></GrayedOutOverlay>

            
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
                <KeyboardAvoidingView
                behavior='padding'
                keyboardVerticalOffset= {100}
                >
                    <View style={styles.answerBox}>
                        <Text style={styles.anotationText}>Answer</Text>
                        <TextInput
                        multiline
                        style={styles.flashcardText}
                        onChangeText={setFlaschardAnswerText}
                        value={flaschardAnswerText}
                        >
                        </TextInput>
                    </View>
                </KeyboardAvoidingView>
            <TouchableHighlight
                style={styles.removeButton}
                onPress={() => props.handleDeleteFlashcard(props.flashcard.GUID)}
                >
                    <AntDesign name="delete" size={24} color="black" />
            </TouchableHighlight>
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