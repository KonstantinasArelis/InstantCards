import { FlashcardPack, FlashcardPackGUID } from '@/types/custom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect} from 'react';

const useFetchLocalFlashcardPack = async (flashcardPackGUID : FlashcardPackGUID) : Promise<FlashcardPack | null> => {
        try{
            const jsonValue = await AsyncStorage.getItem(flashcardPackGUID.GUID)
            return (jsonValue != null ? JSON.parse(jsonValue) : null) 
        } catch(error) {
            return null;
        }
}

export default useFetchLocalFlashcardPack;