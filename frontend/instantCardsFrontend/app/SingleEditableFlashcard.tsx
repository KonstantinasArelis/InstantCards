import { View, Text , StyleSheet, TextInput } from 'react-native'
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
    const [flaschardQuestionText, setFlashcardQuestionText] = useState(props.flashcard.question);
    const [flaschardAnswerText, setFlaschardAnswerText] = useState(props.flashcard.answer);

    useEffect(() => {
        setFlashcardQuestionText(props.flashcard.question);
        setFlaschardAnswerText(props.flashcard.answer);
    }, [props.flashcard])

    return (
            <View style={styles.container}>
                <TextInput
                style={styles.questionBox}
                onChangeText={setFlashcardQuestionText}
                value={flaschardQuestionText}
                >
                </TextInput>

                <TextInput
                style={styles.answerBox}
                onChangeText={setFlaschardAnswerText}
                value={flaschardAnswerText}
                >
                </TextInput>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
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

export default SingleEditableFlashcard;