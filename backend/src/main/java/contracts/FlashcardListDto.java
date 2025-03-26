package contracts;

import entities.FlashcardPack;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import mybatis.model.Flashcardpack;

@Getter
@Setter
public class FlashcardListDto {
    private List<FlashcardListItemDto> items = new ArrayList<>();

    public static FlashcardListDto fromEntities(List<FlashcardPack> packs){
        FlashcardListDto dto = new FlashcardListDto();
        for(FlashcardPack pack : packs){
            dto.items.add(new FlashcardListItemDto(pack));
        }
        return dto;
    }

    public static FlashcardListDto fromMyBatis(List<Flashcardpack> packs){
        FlashcardListDto dto = new FlashcardListDto();
        for(Flashcardpack pack : packs){
            dto.items.add(new FlashcardListItemDto(pack));
        }

        return dto;
    }

    private FlashcardListDto(){

    }
}
