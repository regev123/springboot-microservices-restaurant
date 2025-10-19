package com.restaurant.auth.auth_service.mapper;

import com.restaurant.auth.auth_service.dto.UserDetailsDto;
import com.restaurant.auth.auth_service.dto.UserResponse;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.common.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between UserEntity and DTOs.
 * Follows Single Responsibility Principle by handling only user-related mappings.
 * Follows Open/Closed Principle by being easily extensible for new DTO types.
 */
@Component
@RequiredArgsConstructor
public class UserMapper implements EntityMapper<UserEntity, UserDetailsDto> {

    @Override
    public UserDetailsDto toDto(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return new UserDetailsDto(
                entity.getId(),
                entity.getEmail(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getPhoneNumber(),
                entity.getRole(),
                entity.getCreatedDate()
        );
    }

    @Override
    public UserEntity toEntity(UserDetailsDto dto) {
        if (dto == null) {
            return null;
        }

        UserEntity entity = new UserEntity();
        entity.setId(dto.getId());
        entity.setEmail(dto.getEmail());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setRole(dto.getRole());
        entity.setCreatedDate(dto.getCreatedDate());

        return entity;
    }

    /**
     * Maps UserEntity to UserResponse (simplified DTO).
     * 
     * @param entity the user entity
     * @return simplified user response
     */
    public UserResponse toUserResponse(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return new UserResponse(
                entity.getId(),
                entity.getEmail(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getPhoneNumber(),
                entity.getRole()
        );
    }
}
