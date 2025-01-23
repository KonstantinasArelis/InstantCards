import { View, Text , StyleSheet } from 'react-native'
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

const SingleFlashcard = (props : SingleFlashcardProps) => {
    const colorScheme = useColorScheme();
    const [flaschardText, setFlashcardText] = useState(props.flashcard.question);

    const onPressQuestion = () => {
        if(flaschardText === props.flashcard.question){
            setFlashcardText(props.flashcard.answer);
        } else {
            setFlashcardText(props.flashcard.question);
        }
    }

    useEffect(() => {
        setFlashcardText(props.flashcard.question);
    }, [props.flashcard])

    return (
            <View style={styles.container}>
                <TouchableHighlight 
                onPress={onPressQuestion} 
                underlayColor={Colors[colorScheme ?? 'light'].tint} 
                style={[styles.questionBox, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}>

                        <Text style={styles.questionText}>{flaschardText}</Text>
                </TouchableHighlight>
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
    },
    questionText: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Courier New',
    },
    answer: {
        width: '80%',
        height: '20%',
        backgroundColor: 'orange',
        borderRadius: '20px',
        padding: 20,
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Courier New'
    }
})

export default SingleFlashcard;