import { View, Text , StyleSheet, TextInput, useWindowDimensions } from 'react-native'
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
import { SingleFlashcardProps } from '@/types/custom';



const SingleEditableFlashcard = (props : SingleFlashcardProps) => {
    const colorScheme = useColorScheme();
    const { height } = useWindowDimensions();
    const [flaschardQuestionText, setFlashcardQuestionText] = useState(props.flashcard.question);
    const [flaschardAnswerText, setFlaschardAnswerText] = useState(props.flashcard.answer);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
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

    if(props.flashcard.GUID !== 0) {
        return (
            <View style={[styles.container, {height}]}>
                <View style={styles.questionBox}>
                

                    <Text style={styles.anotationText}>Question</Text>
                    <TextInput
                    
                    style={styles.flashcardText}
                    onChangeText={setFlashcardQuestionText}
                    value={flaschardQuestionText}
                    >
                    </TextInput>
                </View>
                
                <View style={styles.answerBox}>
                    <Text style={styles.anotationText}>Answer</Text>
                    <TextInput
                    style={styles.flashcardText}
                    onChangeText={setFlaschardAnswerText}
                    value={flaschardAnswerText}
                    >
                    </TextInput>
                </View>
                
            </View>
        )
    } else {
        return(
           <View style={[styles.container, {height}]}>
                <View style={styles.endFlashcard}></View>
            </View> 
        )
        
    }

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    questionBox: {
        flex: 0.45,
        borderRadius: 20,
        padding: 20,
        margin: 10,
        backgroundColor: 'orange',
    },
    answerBox: {
        flex: 0.45,
        borderRadius: 20,
        padding: 20,
        margin: 10,
        backgroundColor: 'orange',
    },
    endFlashcard: {
        flex: 0.9,
        borderRadius: 20,
        padding: 20,
        margin: 10,
        backgroundColor: 'orange',
    },
    flashcardText: {
        outlineStyle: 'none',
        height: '100%',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Courier New',
    },
    anotationText: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'Courier New',
    }
})

export default SingleEditableFlashcard;