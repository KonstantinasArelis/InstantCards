package com.instantCards.persistance;

import com.instantCards.entities.FlashcardPack;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class FlashcardPackDAO {
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
    }

    public void deleteFlashcardPack(FlashcardPack flashcardPack){
        em.remove(flashcardPack);
    }
}
