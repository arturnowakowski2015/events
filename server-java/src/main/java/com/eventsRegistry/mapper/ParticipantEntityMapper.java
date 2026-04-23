package com.eventsRegistry.mapper;

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.entity.ParticipantEntity;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;
@Component 
@Mapper(componentModel = "spring", uses = {VehicleMapper.class, RoleMapper.class}, imports = {UUID.class})
public interface ParticipantEntityMapper {

    @Mapping(target = "id", expression = "java(dto.getId() != null ? dto.getId() : UUID.randomUUID())")
    ParticipantEntity toEntity(ParticipantDTO dto);

    ParticipantDTO toDTO(ParticipantEntity entity);
}