package com.instantCards.services;

import com.instantCards.contracts.*;
import com.instantCards.entities.Flashcard;
import com.instantCards.entities.FlashcardPack;
import com.instantCards.persistance.FlashcardPackDAO;
import jakarta.enterprise.concurrent.Asynchronous;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;


@ApplicationScoped
public class FlashcardPackService implements IFlashcardPackService {
    @Inject
    @Setter
    @Getter
    private IFlashcardPackDao flashcardPackDAO;

    @Inject
    private IFlashcardCounter flashcardCounter;

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
            flashcardPack.setName(flashcardPackDto.getName());

            for (FlashcardDto flashcardDto : flashcardPackDto.getFlashcards()) {
                if(flashcardDto.getId() == null){
                    flashcardPack.getFlashcards().add(new Flashcard(flashcardDto, flashcardPack));
                } else {
                    Optional<Flashcard> foundFlashcard =  flashcardPack.getFlashcards().stream()
                            .filter(f -> f.getId().equals(flashcardDto.getId()))
                            .findFirst();
                    if(foundFlashcard.isPresent()){
                        if(!flashcardDto.getForce()){
                            if(foundFlashcard.get().getVersion() > flashcardDto.getVersion()){
                                throw new OptimisticLockException();
                            }
                        }

                        foundFlashcard.get().setAnswer(flashcardDto.getAnswer());
                        foundFlashcard.get().setQuestion(flashcardDto.getQuestion());
                    }
                }
            }

            flashcardPackDAO.updateFlashcardPack(flashcardPack);

            return new FlashcardPackDto(flashcardPack);
        }
    }

    public void performTimelyOperation(Long id){
        try {
            FlashcardPack flashcardPack = flashcardPackDAO.findById(id);
            Flashcard flashcard = flashcardPack.getFlashcards().get(0);
            Thread.sleep(5000);
            if(flashcard != null){
                flashcard.setQuestion("Timely operation completed");
                try{
                    flashcardPackDAO.updateFlashcardPack(flashcardPack);
                } catch(Exception e){
                    throw e;
                }

            }
        } catch (InterruptedException e){
            System.err.println("Thread was interrupted: " + e.getMessage());
        }
    }

    public void performTimelyOperationForce(Long id){
        try {
            // Jeigu per 5 sekundes pasikeis flashcarPack busena, ji bus perrasoma
            Thread.sleep(5000);
            FlashcardPack flashcardPack = flashcardPackDAO.findById(id);
            Flashcard flashcard = flashcardPack.getFlashcards().get(0);
            if(flashcard != null){
                flashcard.setQuestion("Timely operation completed (Forced)");
                try{
                    flashcardPackDAO.updateFlashcardPack(flashcardPack);
                } catch(Exception e){
                    throw e;
                }

            }
        } catch (InterruptedException e){
            System.err.println("Thread was interrupted: " + e.getMessage());
        }
    }

    public String calculateFlashcards(){
        List<FlashcardPack> flashcardPacks = flashcardPackDAO.getAllFlashcardPacks();

        CompletableFuture<Integer> futureResult = flashcardCounter.countFlashcards(flashcardPacks);
        int counter = 0;
        while(true){
            counter++;
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            if(futureResult.isDone()){
                try {
                    return "Card count: " + futureResult.get();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (ExecutionException e) {
                    throw new RuntimeException(e);
                }
            }
            else if(counter>=5){
                futureResult.cancel(true);
                System.out.println("Waited too long, canceling flashcard counting");
                return "Counting cards took too long";
            }
            System.out.println("Waiting " + counter + " seconds...");
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
