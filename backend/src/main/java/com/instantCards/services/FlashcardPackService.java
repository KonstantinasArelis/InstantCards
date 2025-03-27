package com.instantCards.services;

import com.instantCards.contracts.FlashcardDto;
import com.instantCards.contracts.FlashcardPackDto;
import com.instantCards.contracts.IFlashcardPackDao;
import com.instantCards.contracts.IFlashcardPackService;
import com.instantCards.entities.Flashcard;
import com.instantCards.entities.FlashcardPack;
import com.instantCards.persistance.FlashcardPackDAO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class FlashcardPackService implements IFlashcardPackService {
    @Inject
    @Setter
    @Getter
    private IFlashcardPackDao flashcardPackDAO;

    public FlashcardPackDto getFlashcardPack(Long id){
        FlashcardPack retrievedFlashcardPack = flashcardPackDAO.findById(id);
        if(retrievedFlashcardPack == null){
            throw new NotFoundException("Flashcard pack with id " + id + "was not found");
        }

        return new FlashcardPackDto(retrievedFlashcardPack);
    }

    public List<FlashcardPackDto> getAllFlashcardPacks(){
        List<FlashcardPack> allFlashcardPacks = flashcardPackDAO.getAllFlashcardPacks();
        List<FlashcardPackDto> allFlashcardPacksData = new ArrayList<>();
        for(FlashcardPack flashcardPack : allFlashcardPacks){
            FlashcardPackDto flashcardPackData = new FlashcardPackDto(flashcardPack);
            allFlashcardPacksData.add(flashcardPackData);
        }

        return allFlashcardPacksData;
    }

    public FlashcardPackDto createFlashcardPack(FlashcardPackDto newFlashcardPackDto){
        FlashcardPack newFlashcardPack = new FlashcardPack(newFlashcardPackDto);
        flashcardPackDAO.addFlashcardPack(newFlashcardPack);

        return new FlashcardPackDto(newFlashcardPack);
    }

    public FlashcardPackDto updateFlashcardPack(Long id, FlashcardPackDto flashcardPackDto) {
        FlashcardPack flashcardPack = flashcardPackDAO.findById(id);

        if (flashcardPack == null) {
            throw new NotFoundException("FlashcardPack with id " + flashcardPackDto.getId() + " was not found.");
        } else {
            flashcardPack.getFlashcards().clear();
            flashcardPack.setName(flashcardPackDto.getName());

            for (FlashcardDto newFlashcardDto : flashcardPackDto.getFlashcards()) {
                flashcardPack.getFlashcards().add(new Flashcard(newFlashcardDto, flashcardPack));
            }
            flashcardPackDAO.updateFlashcardPack(flashcardPack);

            return new FlashcardPackDto(flashcardPack);
        }
    }

    public void deleteFlashcardPack(Long id){
        FlashcardPack toBeDeletedFlashcardPack = flashcardPackDAO.findById(id);

        if(toBeDeletedFlashcardPack == null) {
            throw new NotFoundException();
        } else {
            flashcardPackDAO.deleteFlashcardPack(toBeDeletedFlashcardPack);
        }
    }
}
