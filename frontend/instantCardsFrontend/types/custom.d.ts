declare module "*.png" {
    const value: any;
    export default value;
}

export interface Flashcard {
    fakeId: string;
    id?: number;
    question: string;
    answer: string;
    version: number;
    force?: boolean;
}

export interface FlashcardPack {
    id?: string;
    name: string;
    flashcards: Flashcard[];
    version: number;
    force?: boolean;
}

export interface FlashcardPackBasicInfo {
    id: number;
    name: string;
}

export type  FlashcardPackBasicInfoList = FlashcardPackBasicInfo[];

interface SingleFlashcardProps {
     scrollX: SharedValue<number>;
     flashcard: Flashcard;
     flashcardIndex: number;
     handleFlashcardUpdate: (updatedFlashcard: Flashcard) => void;
     handleAddFlashcard: () => void;
     handleDeleteFlashcard: (flashcardFakeId: string) => void;
}

interface FlashcardPackGUIDFromRoute {
    GUID: string;
}