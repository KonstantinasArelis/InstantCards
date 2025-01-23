import { View, Text , StyleSheet, TouchableHighlight } from 'react-native'
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const PreviousFlashcardButton = ({handlePrevious} : any) => {
    const colorScheme = useColorScheme();
    return (
        <TouchableHighlight 
        style={[styles.previousButton, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}
        onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    previousButton: {
        width: 100,
        height: 40,
        margin: 10,
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
    }
})

export default PreviousFlashcardButton;