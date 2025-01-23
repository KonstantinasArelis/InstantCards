import { View, Text , StyleSheet, TouchableHighlight } from 'react-native'
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const NextFlashcardButton = ({handleNext} : any) => {
    const colorScheme = useColorScheme();
    return (
        <TouchableHighlight 
        style={[styles.nextButton, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}
        onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
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
    }
})

export default NextFlashcardButton;