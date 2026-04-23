package com.eventsRegistry.mapper;

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.entity.ParticipantEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {VehicleMapper.class, RoleMapper.class})
public interface ParticipantEntityMapper {
    ParticipantEntity toEntity(ParticipantDTO dto);

    ParticipantDTO toDTO(ParticipantEntity entity);
}
