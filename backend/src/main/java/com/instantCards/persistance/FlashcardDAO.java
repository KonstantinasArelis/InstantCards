package com.instantCards.persistance;

import com.instantCards.entities.Flashcard;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class FlashcardDAO {
    @Inject
    private EntityManager em;

    public Flashcard findById(Long id){
        return em.find(Flashcard.class, id);
    }
    @Transactional(Transactional.TxType.NEVER)
    public void addFlashcard(Flashcard flashcard){
        em.persist(flashcard);
    }
}
