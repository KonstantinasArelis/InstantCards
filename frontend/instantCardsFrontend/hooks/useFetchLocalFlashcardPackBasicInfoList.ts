import { FlashcardPackBasicInfoList } from '@/types/custom';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchLocalFlashcardPackBasicInfoList = async () : Promise<FlashcardPackBasicInfoList | Error> => {
        try{
            const jsonValue = await AsyncStorage.getItem("FlashcardPackBasicInfoList");
            if(jsonValue === null){
                return new Error("Retrieved flashcard pack basic info list from local storage, but it is null");
            } else {
                return JSON.parse(jsonValue);
            }
        } catch (error){
            console.error("Error getting flashcard:", error);
            if(error instanceof Error){
                return error
            } else {
                return new Error("Error getting flashcard pack basic info list. The encountered error does not support Error type");
            }
        }
}

export default useFetchLocalFlashcardPackBasicInfoList;