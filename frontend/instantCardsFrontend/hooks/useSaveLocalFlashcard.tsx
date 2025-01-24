import { Flashcard } from "@/types/custom";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSaveLocalFlashcard = async (newFlashcard : Flashcard) : Promise<null | Error> => {
    try{
        const jsonString = JSON.stringify(newFlashcard);
        await AsyncStorage.setItem(newFlashcard.GUID,jsonString);
        return null;
    } catch (error){
        console.error("Error saving flashcard:", error);
        if(error instanceof Error){
            return error
        } else {
            return new Error("Error saving flashcard. The encountered error does not support Error type");
        }
    }
}

export default useSaveLocalFlashcard;