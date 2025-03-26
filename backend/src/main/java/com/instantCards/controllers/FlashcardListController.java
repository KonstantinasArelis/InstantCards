package com.instantCards.controllers;

import com.instantCards.contracts.FlashcardListDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.instantCards.services.FlashcardPackListService;

@ApplicationScoped
@Path("/flashcardList")
@Produces(MediaType.APPLICATION_JSON)
public class FlashcardListController {
    @Inject
    FlashcardPackListService service;

    @GET
    @Path("/getList")
    @Transactional
    public Response getList(){
        try {
            FlashcardListDto data = service.getFlashcardPackList();
            return Response.ok(data).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching flashcard pack list: " + e.getMessage())
                    .build();
        }
    }
}
