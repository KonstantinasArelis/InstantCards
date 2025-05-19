package com.instantCards.contracts;

import com.instantCards.entities.Flashcard;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlashcardDto {
    private Long id;
    private String question;
    private String answer;
    private Long flashcardPackId;
    private Long version;
    private boolean force;

    public boolean getForce(){
        return this.force;
    }

    public void setForce(boolean force){
        this.force = force;
    }

    public FlashcardDto(){};

    public FlashcardDto(Flashcard flashcard){
        this.id = flashcard.getId();
        this.question = flashcard.getQuestion();
        this.answer = flashcard.getAnswer();
        this.flashcardPackId = flashcard.getFlashcardPack().getId();
        this.version = flashcard.getVersion();
    };
}
