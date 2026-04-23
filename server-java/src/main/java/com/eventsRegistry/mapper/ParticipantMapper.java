package com.eventsRegistry.mapper;

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.entity.ParticipantEntity;
import com.eventsRegistry.entity.RoleEntity;
import com.eventsRegistry.entity.VehicleEmbeddable;
import com.eventsRegistry.mapper.RoleMapper;
import com.eventsRegistry.entity.ParticipantRoleEntity;
import com.eventsRegistry.entity.VehicleEntity;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
 
	@Component
	public class ParticipantMapper {

	    private final RoleMapper roleMapper;

	    public ParticipantMapper(RoleMapper roleMapper) {
	        this.roleMapper = roleMapper;
	    }

	    public ParticipantEntity dtoToEntity(ParticipantDTO dto) {
	        if (dto == null) return null;
	        ParticipantEntity e = new ParticipantEntity();
	        e.setId(dto.getId() != null ? dto.getId() : UUID.randomUUID());
	        e.setFirstName(dto.getFirstName());
	        e.setLastName(dto.getLastName());
	        e.setPersonalId(dto.getPersonalId());

	        if (dto.getVehicle() != null) {
	            VehicleEntity v = new VehicleEntity();
	            v.setMake(dto.getVehicle().getMake());
	            v.setModel(dto.getVehicle().getModel());
	            v.setLicensePlate(dto.getVehicle().getLicensePlate());
	            v.setVin(dto.getVehicle().getVin());
	            v.setInsurancePolicyNumber(dto.getVehicle().getInsurancePolicyNumber());
	            e.setVehicle(v);
	        }

	        if (dto.getRoles() != null) {
	            e.setRoles(dto.getRoles().stream()
	                .map(roleMapper::toEntity)
	                .collect(Collectors.toList()));
	        }
	        return e;
	    }

  
	 public static ParticipantDTO entityToDto(ParticipantEntity e) {
	        if (e == null) return null;
	        ParticipantDTO dto = new ParticipantDTO();
	        dto.setId(e.getId());
	        dto.setFirstName(e.getFirstName());
	        dto.setLastName(e.getLastName());
	        dto.setPersonalId(e.getPersonalId());
	        // map vehicle and roles similarly...
	        return dto;
	    }
   
}