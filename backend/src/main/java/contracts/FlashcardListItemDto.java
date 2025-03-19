package contracts;

import entities.FlashcardPack;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlashcardListItemDto {
    private String name;
    private Long id;

    public FlashcardListItemDto(FlashcardPack pack){
        this.name = pack.getName();
        this.id = pack.getId();
    }
}
