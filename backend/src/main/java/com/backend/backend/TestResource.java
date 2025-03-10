package com.backend.backend;

import entities.TestEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/test")
public class TestResource {

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
}