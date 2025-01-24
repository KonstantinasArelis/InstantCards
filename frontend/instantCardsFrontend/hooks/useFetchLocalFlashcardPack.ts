import { FlashcardPack, FlashcardPackGUID } from '@/types/custom';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchLocalFlashcardPack = async (flashcardPackGUID : FlashcardPackGUID) : Promise<FlashcardPack | Error> => {
        try{
            const jsonValue = await AsyncStorage.getItem(flashcardPackGUID)
            if(jsonValue === null){
                return new Error("Retrieved flashcard pack from local storage, but it is null.");
            } else {
                return JSON.parse(jsonValue);
            }
        } catch (error){
            console.error("Error getting flashcard:", error);
            if(error instanceof Error){
                return error
            } else {
                return new Error("Error getting flashcard. The encountered error does not support Error type");
            }
        }
}

export default useFetchLocalFlashcardPack;