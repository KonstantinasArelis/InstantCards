interface FlashcardPack {
  name: string;
  GUID: string;
  flashcards: {question: string; answer: string }[];
}

export const flashcardPack: FlashcardPack = 
{
  "name" : "Basic flashcards",
  "GUID" : "4549f3bb-5133-4d6f-aeee-b38c2f9eaf74",
  "flashcards": [
  {
    "question": "What is the capital of France?",
    "answer": "Paris"
  },
  {
    "question": "Who painted the Mona Lisa?",
    "answer": "Leonardo da Vinci"
  },
  {
    "question": "What is the chemical symbol for water?",
    "answer": "H2O"
  },
  {
    "question": "In what year did World War II begin?",
    "answer": "1939"
  },
  {
    "question": "What is the largest planet in our solar system?",
    "answer": "Jupiter"
  }
  ]
};

export const flashcardPack2: FlashcardPack = {
  "name": "Math flashcards",
  "GUID": "e089bd7a-629f-498c-b41f-904f85b13993",
  "flashcards": [
    {
      "question": "What is the square root of 144?",
      "answer": "12"
    },
    {
      "question": "What is the sum of the angles in a triangle?",
      "answer": "180 degrees"
    },
    {
      "question": "What is the formula for the area of a circle?",
      "answer": "πr² (pi times the radius squared)"
    },
    {
      "question": "What is the value of pi to two decimal places?",
      "answer": "3.14"
    },
    {
      "question": "What is 5 factorial (5!)?",
      "answer": "120"
    }
  ]
};

export const flashcardPack3: FlashcardPack = {
  "name": "Coding flashcards",
  "GUID": "89a7f486-c847-433d-a094-49f60919111f",
  "flashcards": [
    {
      "question": "What does HTML stand for?",
      "answer": "HyperText Markup Language"
    },
    {
      "question": "What is the correct syntax for a JavaScript function?",
      "answer": "function myFunction() { // code to be executed }"
    },
    {
      "question": "What is the difference between `let` and `const` in JavaScript?",
      "answer": "`let` allows you to reassign the variable, while `const` does not."
    },
    {
      "question": "What is an API?",
      "answer": "Application Programming Interface"
    },
    {
      "question": "What is the purpose of CSS?",
      "answer": "To style the HTML elements of a webpage."
    }
  ]
};