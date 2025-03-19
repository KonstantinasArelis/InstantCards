package contracts;

import entities.FlashcardPack;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlashcardListDto {
    private List<FlashcardListItemDto> items = new ArrayList<>();

    public FlashcardListDto(List<FlashcardPack> packs){
        for(FlashcardPack pack : packs){
            items.add(new FlashcardListItemDto(pack));
        }
    }
}
