declare module "*.png" {
    const value: any;
    export default value;
}

export type FlashcardGuid = string;

export type FlashcardGuidList = FlashcardGuid[];

export interface Flashcard {
    id: FlashcardGuid;
    question: string;
    answer: string;
}

export interface FlashcardPack {
    id: string;
    name: string;
    flashcards: Flashcard[]
}

export interface FlashcardPackBasicInfo {
    id: number;
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