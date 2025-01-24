interface Flashcard {
  "GUID": string;
  "question": string;
  "answer": string;
}

interface FlashcardPack {
  "name": string;
  "GUID": string;
  "flashcardGUIDs": string[];
}

export const flashcard1: Flashcard = {
  "GUID": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "question": "What is the capital of France?",
  "answer": "Paris"
};

export const flashcard2: Flashcard = {
  "GUID": "b2c3d4e5-f678-9012-3456-7890abcdef1",
  "question": "Who painted the Mona Lisa?",
  "answer": "Leonardo da Vinci"
};

export const flashcard3: Flashcard = {
  "GUID": "c3d4e5f6-7890-1234-5678-90abcdef12",
  "question": "What is the chemical symbol for water?",
  "answer": "H2O"
};

export const flashcard4: Flashcard = {
  "GUID": "d4e5f678-9012-3456-7890-abcdef123",
  "question": "In what year did World War II begin?",
  "answer": "1939"
};

export const flashcard5: Flashcard = {
  "GUID": "e5f67890-1234-5678-90ab-cdef12345",
  "question": "What is the largest planet in our solar system?",
  "answer": "Jupiter"
};

// Create the FlashcardPack object with an array of flashcard GUIDs
export const flashcardPack: FlashcardPack = {
  "name": "Basic flashcards",
  "GUID": "4549f3bb-5133-4d6f-aeee-b38c2f9eaf74",
  "flashcardGUIDs": [
    flashcard1.GUID,
    flashcard2.GUID,
    flashcard3.GUID,
    flashcard4.GUID,
    flashcard5.GUID
  ]
};