package entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class FlashcardPack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @OneToMany(mappedBy = "flashcardPack", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Flashcard> flashcards = new ArrayList<>();

    // Constructors
    public FlashcardPack() {
    }

    public FlashcardPack(String name) {
        this.name = name;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public List<Flashcard> getFlashcards(){
        return flashcards;
    }

    public void setFlashcards(List<Flashcard> flashcards){
        this.flashcards = flashcards;
    }

    @Override
    public String toString() {
        return "FlashcardPack{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", flashcards.size()=" + flashcards.size() + // Display number of flashcards, avoid loading all in toString
                '}';
    }
}
