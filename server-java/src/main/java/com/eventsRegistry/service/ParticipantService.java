package com.eventsRegistry.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.dto.RoleDTO;
import com.eventsRegistry.dto.VehicleDTO;
import com.eventsRegistry.entity.ParticipantEntity;
import com.eventsRegistry.mapper.ParticipantEntityMapper;
import com.eventsRegistry.repository.ParticipantRepository;
import com.eventsRegistry.model.GenericRole;
import com.eventsRegistry.model.Participant;
import com.eventsRegistry.model.Perpetrator;
import com.eventsRegistry.model.ParticipantRole;
import com.eventsRegistry.model.Victim;
import com.eventsRegistry.model.Vehicle;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final ParticipantEntityMapper participantEntityMapper;

    public ParticipantService(ParticipantRepository participantRepository,
                              ParticipantEntityMapper participantEntityMapper) {
        this.participantRepository = participantRepository;
        this.participantEntityMapper = participantEntityMapper;
    }

    // Keep existing toModel implementation (maps DTO -> model)
    public Participant toModel(ParticipantDTO dto) {
        if (dto == null) return null;
        Participant p = new Participant(dto.getFirstName(), dto.getLastName(), dto.getPersonalId());
        VehicleDTO vdto = dto.getVehicle();
        if (vdto != null) {
            Vehicle v = new Vehicle(vdto.getMake(), vdto.getLicensePlate());
            v.setModel(vdto.getModel());
            v.setVin(vdto.getVin());
            v.setInsurancePolicyNumber(vdto.getInsurancePolicyNumber());
            p.setVehicle(v);
        }
        List<RoleDTO> roles = dto.getRoles();
        if (roles != null) {
            for (RoleDTO rd : roles) {
                ParticipantRole role = null;
                if ("Perpetrator".equalsIgnoreCase(rd.getRoleName())) {
                    Perpetrator pp = new Perpetrator();
                    pp.setDescription(rd.getDescription());
                    pp.setTicketNumber(rd.getDescription());
                    role = pp;
                } else if ("Victim".equalsIgnoreCase(rd.getRoleName())) {
                    Victim v = new Victim();
                    v.setDescription(rd.getDescription());
                    v.setDamageDescription(rd.getDescription());
                    role = v;
                } else {
                    GenericRole gr = new GenericRole();
                    gr.setRoleName(rd.getRoleName());
                    gr.setDescription(rd.getDescription());
                    gr.setUnknown(true);
                    gr.putMetadata("rawDescription", rd.getDescription());
                    role = gr;
                }
                p.addRole(role);
            }
        }
        return p;
    }

    // Keep existing toDTO implementation (maps model -> DTO)
    public ParticipantDTO toDTO(Participant p) {
        if (p == null) return null;
        ParticipantDTO dto = new ParticipantDTO();
        dto.setFirstName(p.getFirstName());
        dto.setLastName(p.getLastName());
        dto.setPersonalId(p.getPersonalId());
        // id is retrieved from DB when possible; caller may set it
        if (p.getVehicle() != null) {
            Vehicle v = p.getVehicle();
            VehicleDTO vdto = new VehicleDTO();
            vdto.setMake(v.getMake());
            vdto.setModel(v.getModel());
            vdto.setLicensePlate(v.getLicensePlate());
            vdto.setVin(v.getVin());
            vdto.setInsurancePolicyNumber(v.getInsurancePolicyNumber());
            dto.setVehicle(vdto);
        }
        List<com.eventsRegistry.dto.RoleDTO> rdlist = new ArrayList<>();
        if (p.getRoles() != null) {
            for (com.eventsRegistry.model.IRole r : p.getRoles()) {
                RoleDTO rd = new RoleDTO();
                rd.setRoleName(r.getRoleName());
                rd.setDescription(r.getDescription());
                rdlist.add(rd);
            }
        }
        dto.setRoles(rdlist);
        return dto;
    }

    // Persist participant model by converting -> DTO -> Entity and saving. Return generated id (UUID string).
    public UUID save(Participant p) {
        if (p == null) return null;
        ParticipantDTO dto = toDTO(p);
        com.eventsRegistry.entity.ParticipantEntity entity = participantEntityMapper.toEntity(dto);
        if (entity.getId() == null  ) {
            entity.setId(UUID.randomUUID());
        }
        ParticipantEntity saved = participantRepository.save(entity);
        return saved.getId();
    }

    public Participant save(UUID id, Participant participant) {
        if (id == null  || participant == null) {
            return null;
        }
        ParticipantDTO dto = toDTO(participant);
        ParticipantEntity entity = participantEntityMapper.toEntity(dto);
        entity.setId(id);
        participantRepository.save(entity);
        return participant;
    }

    public Participant findById(UUID id) {
        if (id == null  ) return null;
        Optional<ParticipantEntity> oe = participantRepository.findById(id);
        if (oe.isEmpty()) return null;
        ParticipantDTO dto = participantEntityMapper.toDTO(oe.get());
        Participant model = toModel(dto);
        // set id on DTO -> model is not tracking id; if needed callers can find id via DB
        return model;
    }

    public List<Participant> findAll() {
        List<ParticipantEntity> all = participantRepository.findAll();
        return all.stream()
                .map(e -> toModel(participantEntityMapper.toDTO(e)))
                .collect(Collectors.toList());
    }

    public Participant deleteById(String id) {
        if (id == null || id.isBlank()) return null;
        Optional<ParticipantEntity> oe = participantRepository.findById(id);
        if (oe.isEmpty()) return null;
        ParticipantDTO dto = participantEntityMapper.toDTO(oe.get());
        Participant model = toModel(dto);
        participantRepository.deleteById(id);
        return model;
    }
}
