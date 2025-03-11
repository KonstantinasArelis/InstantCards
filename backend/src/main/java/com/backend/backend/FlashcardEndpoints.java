package com.backend.backend;

import entities.TestEntity;
import entities.Flashcard;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

import java.net.URI;

@Path("/flashcard")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class FlashcardEndpoints {
    @PersistenceContext(unitName = "myPersistenceUnit") // Match your persistence-unit name
    private EntityManager em;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public String testDatabase() {
        try {
            TestEntity entity = new TestEntity("Hello from JPA!");
            em.persist(entity);
            TestEntity retrievedEntity = em.find(TestEntity.class, entity.getId());
            if (retrievedEntity != null && "Hello from JPA!".equals(retrievedEntity.getData())) {
                return "Database interaction successful! Entity ID: " + retrievedEntity.getId();
            } else {
                return "Database interaction failed: Could not retrieve persisted entity.";
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log detailed exception for debugging
            return "Database interaction failed: Exception - " + e.getMessage();
        }
    }

    @GET
    @Path("/{id}")
    @Transactional
    public Response getFlashcard(Long id) {
        try{
            entities.Flashcard retrievedFlashcard = em.find(entities.Flashcard.class, id);
            if(retrievedFlashcard != null){
                return Response.ok(retrievedFlashcard).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("\"Flashcard with id \" + id + \" not found\"").build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log detailed exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/create")
    @Transactional
    public Response createFlashcard(Flashcard newFlashcard) {
        try {
            // TODO validation
            em.persist(newFlashcard);
            em.flush();

            URI createdUri = URI.create("/api/flashcard/" + newFlashcard.getId());
            return Response.created(createdUri)
                    .entity(newFlashcard)
                    .build();

        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating flashcard: " + e.getMessage())
                    .build();
        }
    }
}