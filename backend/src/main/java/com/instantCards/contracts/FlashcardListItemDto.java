package com.instantCards.contracts;

import com.instantCards.entities.FlashcardPack;
import lombok.Getter;
import lombok.Setter;
import mybatis.model.Flashcardpack;

@Getter
@Setter
public class FlashcardListItemDto {
    private String name;
    private Long id;

    public FlashcardListItemDto(FlashcardPack pack){
        this.name = pack.getName();
        this.id = pack.getId();
    }

    public FlashcardListItemDto(Flashcardpack pack){
        this.name = pack.getName();
        this.id = pack.getId();
    }
}
