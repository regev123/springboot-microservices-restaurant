package com.restaurant.common.mapper;

/**
 * Generic interface for mapping between entities and DTOs.
 * This interface provides a standardized contract for entity-DTO conversion
 * across all microservices in the restaurant system.
 * 
 * @param <E> Entity type
 * @param <D> DTO type
 */
public interface EntityMapper<E, D> {
    
    /**
     * Converts an entity to its corresponding DTO.
     * 
     * @param entity the entity to convert
     * @return the corresponding DTO
     */
    D toDto(E entity);
    
    /**
     * Converts a DTO to its corresponding entity.
     * 
     * @param dto the DTO to convert
     * @return the corresponding entity
     */
    E toEntity(D dto);
}
