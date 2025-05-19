package com.instantCards.persistance;

import com.instantCards.contracts.IFlashcardPackDao;
import com.instantCards.entities.FlashcardPack;
import com.instantCards.entities.Flashcard;

import jakarta.enterprise.concurrent.Asynchronous;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@ApplicationScoped
public class FlashcardPackDAO implements IFlashcardPackDao {
    @Inject
    private EntityManager em;

    public FlashcardPack findById(Long id){
        return em.find(FlashcardPack.class, id);
    }

    public List<FlashcardPack> getAllFlashcardPacks(){
        return em.createQuery("SELECT f FROM FlashcardPack f", FlashcardPack.class).getResultList();
    }

    public void addFlashcardPack(FlashcardPack flashcardPack){
        em.persist(flashcardPack);
        // may need em.flush();
    }

    public void updateFlashcardPack(FlashcardPack flashcardPack){
        em.merge(flashcardPack);
        em.flush();
    }

    @Asynchronous
    public CompletableFuture<String> performTimelyOperation(FlashcardPack flashcardPack){
        try {
            Thread.sleep(5000);
            return CompletableFuture.supplyAsync(() -> {
                em.merge(flashcardPack);
                em.flush();
                return "Operation Completed";
            });
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Task interrupted", e);
        }
    }

    public void deleteFlashcardPack(FlashcardPack flashcardPack){
        em.remove(flashcardPack);
    }
}
