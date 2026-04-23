package com.eventsRegistry.mapper;

import com.eventsRegistry.dto.VehicleDTO;
import com.eventsRegistry.entity.VehicleEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    VehicleEntity toEntity(VehicleDTO dto);
    VehicleDTO toDTO(VehicleEntity entity);
}
