package com.backend.backend;

import contracts.FlashcardListDto;
import entities.FlashcardPack;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/flashcardList")
@Produces(MediaType.APPLICATION_JSON)
public class flashcardList {
    @PersistenceContext(unitName = "myPersistenceUnit")
    private EntityManager em;

    @GET
    @Path("/getList")
    @Transactional
    public Response getList(){
        try {
            List<FlashcardPack> packs = em.createQuery("SELECT f FROM FlashcardPack f", FlashcardPack.class).getResultList();
            FlashcardListDto data = new FlashcardListDto(packs);
            return Response.ok(data).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching flashcard pack list: " + e.getMessage())
                    .build();
        }
    }
}
