import { FlashcardPackBasicInfoList } from "@/types/custom";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSaveLocalFlashcardPackBasicInfoList = async (newFlashcardPackBasicInfoList : FlashcardPackBasicInfoList) : Promise<null | Error> => {
    try{
        const jsonString = JSON.stringify(newFlashcardPackBasicInfoList);
        await AsyncStorage.setItem("FlashcardPackBasicInfoList",jsonString);
        return null;
    } catch (error){
        console.error("Error saving flashcard pack basic info list:", error);
        if(error instanceof Error){
            return error
        } else {
            return new Error("Error saving flashcard pack basic info list. The encountered error does not support Error type");
        }
    }
}

export default useSaveLocalFlashcardPackBasicInfoList;