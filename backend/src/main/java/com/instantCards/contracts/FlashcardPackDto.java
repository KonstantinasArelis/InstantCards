package com.instantCards.contracts;

import com.instantCards.entities.Flashcard;
import com.instantCards.entities.FlashcardPack;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class FlashcardPackDto {
    private Long id;
    private String name;
    private List<FlashcardDto> flashcards;

    public FlashcardPackDto(){};

    public FlashcardPackDto(FlashcardPack flashcardPack){
        this.id = flashcardPack.getId();
        this.name = flashcardPack.getName();

        List<FlashcardDto> flashcardDtoList = new ArrayList<>();
        for (Flashcard flashcard : flashcardPack.getFlashcards()) {
            flashcardDtoList.add(new FlashcardDto(flashcard));
        }
        this.flashcards = flashcardDtoList;
    }
}
