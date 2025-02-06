declare module "*.png" {
    const value: any;
    export default value;
}

export type FlashcardGuid = string;

export type FlashcardGuidList = FlashcardGuid[];

export interface Flashcard {
    GUID: FlashcardGuid;
    question: string;
    answer: string;
}

export interface FlashcardPack {
    GUID: string;
    name: string;
    flashcards: Flashcard[]
}

export type FlashcardPackGUID = string;

export interface FlashcardPackBasicInfo {
    GUID: FlashcardPackGUID;
    name: string;
}

export type  FlashcardPackBasicInfoList = FlashcardPackBasicInfo[];

interface SingleFlashcardProps {
    flashcard: Flashcard;
    flashcardIndex: number;
}

interface FlashcardPackGUIDFromRoute {
    GUID: string;
}