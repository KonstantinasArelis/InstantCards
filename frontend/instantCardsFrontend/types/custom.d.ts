declare module "*.png" {
    const value: any;
    export default value;
}

export interface Flashcard {
    question: string;
    answer: string;
}

export interface FlashcardPack {
    name: string;
    GUID: string;
    flashcards: Flashcard[]
}

export interface FlashcardPackGUID{
    GUID: string;
    name: string;
}

export type  FlashcardPackGUIDList = FlashcardPackGUID[];

interface SingleFlashcardProps {
    flashcard: Flashcard;
}

interface FlashcardPackGUIDFromRoute {
    GUID: string;
}