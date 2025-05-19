package com.instantCards.entities;

import com.instantCards.contracts.FlashcardDto;
import jakarta.persistence.*;
import jakarta.persistence.Version;

@Entity
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "Text", name = "test")
    private String answer;

    @ManyToOne
    @JoinColumn(name = "flashcard_pack_id", nullable = false)
    private FlashcardPack flashcardPack;

    @Version
    private Long version;

    public Flashcard(){
    }

    public Flashcard(FlashcardDto flashcardDto, FlashcardPack flashcardPack){
        setQuestion(flashcardDto.getQuestion());
        setAnswer(flashcardDto.getAnswer());
        setFlashcardPack(flashcardPack);
    }

    public Flashcard(String question, String answer, FlashcardPack flashcardPack){
        this.question = question;
        this.answer = answer;
        this.flashcardPack = flashcardPack;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public FlashcardPack getFlashcardPack() {
        return flashcardPack;
    }

    public void setFlashcardPack(FlashcardPack flashcardPack) {
        this.flashcardPack = flashcardPack;
    }

    public Long getVersion(){return version;}

    public void setVersion(Long version){this.version = version;}

    @Override
    public String toString() {
        return "Flashcard{" +
                "id=" + id +
                ", front='" + question + '\'' +
                ", back='" + answer + '\'' +
                ", flashcardPack=" + flashcardPack.getName() +
                '}';
    }
}
