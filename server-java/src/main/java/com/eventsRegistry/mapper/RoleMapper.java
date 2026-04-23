package com.eventsRegistry.mapper;

import com.eventsRegistry.dto.RoleDTO;
import com.eventsRegistry.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

import java.util.HashMap;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    // MapStruct will pick the correct method when converting entity -> DTO by runtime type
    default RoleDTO toDTO(ParticipantRoleEntity entity) {
        if (entity == null) return null;
        RoleDTO rd = new com.eventsRegistry.dto.RoleDTO();
        rd.setRoleName(entity.getClass().getSimpleName().replace("Entity",""));
        rd.setDescription(entity.getDescription());
        return rd;
    }

    // Convert DTO -> concrete entity depending on roleName
    default ParticipantRoleEntity toEntity(RoleDTO dto) {
        if (dto == null) return null;
        String rn = dto.getRoleName();
        if (rn == null) rn = "";
        switch (rn.toLowerCase()) {
            case "perpetrator":
                PerpetratorEntity p = new PerpetratorEntity();
                p.setDescription(dto.getDescription());
                // ticketNumber not available in DTO; kept in description or can be set separately
                return p;
            case "victim":
                VictimEntity v = new VictimEntity();
                v.setDescription(dto.getDescription());
                return v;
            default:
                GenericRoleEntity g = new GenericRoleEntity();
                g.setRoleName(dto.getRoleName());
                g.setDescription(dto.getDescription());
                g.getMetadata().put("rawDescription", dto.getDescription());
                return g;
        }
    }
}
