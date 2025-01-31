import { FlashcardPack, FlashcardPackGUID } from "@/types/custom";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRemoveLocalFlashcardPack = async (flashcardPackGUID : FlashcardPackGUID) : Promise<null | Error> => {
    try{
        await AsyncStorage.removeItem(flashcardPackGUID);
        return null;
    } catch (error){
        console.error("Error removing flashcard pack:", error);
        if(error instanceof Error){
            return error
        } else {
            return new Error("Error removing flashcard pack. The encountered error does not support Error type");
        }
    }
}

export default useRemoveLocalFlashcardPack;