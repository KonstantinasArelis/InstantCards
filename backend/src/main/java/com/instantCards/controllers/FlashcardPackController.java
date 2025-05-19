package com.instantCards.controllers;

import com.instantCards.contracts.FlashcardPackDto;
import com.instantCards.contracts.IFlashcardPackService;
import com.instantCards.services.FlashcardPackService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.UriBuilder;
import java.util.List;
import java.net.URI;

// TODO instead of controllers returning error message, log them internally

@RequestScoped
@Path("/flashcardPack")
@Produces(MediaType.APPLICATION_JSON)
public class FlashcardPackController {
    @Inject
    private IFlashcardPackService flashcardPackService;

    @GET
    @Path("/{id}")
    @Transactional
    public Response getFlashcardPack(@PathParam("id") Long id) {
        try{
            FlashcardPackDto flashcardPackData = flashcardPackService.getFlashcardPack(id);
            return Response.ok(flashcardPackData).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log detailed exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/getAll")
    @Transactional
    public Response getAllFlashcardPacks() {
        try {
            List<FlashcardPackDto> allFlashcardPacksData = flashcardPackService.getAllFlashcardPacks();
            return Response.ok(allFlashcardPacksData).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching all flashcardPacks: " + e.getMessage())
                    .build();
        }
    }

    @POST
    @Path("/create")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createFlashcardPack(FlashcardPackDto newFlashcardPackDto) {
        try {
            //TODO make sure user does not provide id when creating flashcard pack
            FlashcardPackDto createdFlashcardPack = flashcardPackService.createFlashcardPack(newFlashcardPackDto);
            URI locationUri = UriBuilder
                    .fromResource(FlashcardPackController.class)
                    .path(String.valueOf(createdFlashcardPack.getId()))
                    .build();

            return Response.created(locationUri).entity(createdFlashcardPack).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }  catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating flashcardPack: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Path("/update/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateFlashcardPack(@PathParam("id") Long id, FlashcardPackDto flashcardPackDto) {
        try {
            //TODO make sure user does not provide id when updating flashcard pack
            FlashcardPackDto updatedFlashcardPackDto = flashcardPackService.updateFlashcardPack(id, flashcardPackDto);
            return Response.ok(updatedFlashcardPackDto).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        } catch (OptimisticLockException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
        }
        catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error updating flashcardPack: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Path("/timelyOperation/{id}")
    @Transactional
    public Response performTimelyOperation(@PathParam("id") Long id){
        try {
            flashcardPackService.performTimelyOperation(id);
        } catch(OptimisticLockException e) { // Catches direct OLE
            // Log e if necessary
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\":\"Conflict: Data has been modified by another user.\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        } catch (Exception e) { // Catches RollbackException or other exceptions
            Throwable cause = e;
            boolean isOptimisticLock = false;
            while (cause != null) {
                if (cause instanceof OptimisticLockException) {
                    isOptimisticLock = true;
                    break;
                }
                cause = cause.getCause();
            }

            if (isOptimisticLock) {
                // Log e if necessary (it contains the full context)
                return Response.status(Response.Status.CONFLICT)
                        .entity("{\"error\":\"Conflict: Data has been modified by another user (detected during transaction commit).\"}")
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            } else {
                e.printStackTrace(); // Log the full exception for debugging other types of errors
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"error\":\"Error updating flashcardPack: " + e.getMessage() + "\"}")
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            }
        }

        return Response.noContent().build();
    }

    @PUT
    @Path("/timelyOperation/force/{id}")
    @Transactional
    public Response performTimelyOperationForce(@PathParam("id") Long id){
        try {
            flashcardPackService.performTimelyOperationForce(id);
        } catch(OptimisticLockException e) { // Catches direct OLE
            // Log e if necessary
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\":\"Conflict: Data has been modified by another user.\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        } catch (Exception e) { // Catches RollbackException or other exceptions
            Throwable cause = e;
            boolean isOptimisticLock = false;
            while (cause != null) {
                if (cause instanceof OptimisticLockException) {
                    isOptimisticLock = true;
                    break;
                }
                cause = cause.getCause();
            }

            if (isOptimisticLock) {
                // Log e if necessary (it contains the full context)
                return Response.status(Response.Status.CONFLICT)
                        .entity("{\"error\":\"Conflict: Data has been modified by another user (detected during transaction commit).\"}")
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            } else {
                e.printStackTrace(); // Log the full exception for debugging other types of errors
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"error\":\"Error updating flashcardPack: " + e.getMessage() + "\"}")
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            }
        }

        return Response.noContent().build();
    }

    @GET
    @Path("/calculateCards")
    @Produces(MediaType.APPLICATION_JSON)
    public Response calculateFlashcards(){
        try {
            String result = flashcardPackService.calculateFlashcards();
            return Response.ok()
                    .entity(result)
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching all flashcardPacks: " + e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/delete/{id}")
    @Transactional
    public Response deleteFlashcardPack(@PathParam("id") Long id){
        try {
            flashcardPackService.deleteFlashcardPack(id);
            return Response.noContent().build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }  catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting flashcardPack: " + e.getMessage())
                    .build();
        }
    }
}