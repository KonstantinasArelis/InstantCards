import { FlashcardPack } from "@/types/custom";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSaveLocalFlashcardPack = async (newFlashcardPack : FlashcardPack) : Promise<null | Error> => {
    try{
        const jsonString = JSON.stringify(newFlashcardPack);
        await AsyncStorage.setItem(newFlashcardPack.GUID,jsonString);
        return null;
    } catch (error){
        console.error("Error saving flashcard pack:", error);
        if(error instanceof Error){
            return error
        } else {
            return new Error("Error saving flashcard pack. The encountered error does not support Error type");
        }
    }
}

export default useSaveLocalFlashcardPack;