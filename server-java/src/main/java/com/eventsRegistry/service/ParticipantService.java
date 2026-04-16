package com.eventsRegistry.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.dto.RoleDTO;
import com.eventsRegistry.dto.VehicleDTO;
import com.eventsRegistry.model.GenericRole;
import com.eventsRegistry.model.Participant;
import com.eventsRegistry.model.Perpetrator;
import com.eventsRegistry.model.ParticipantRole;
import com.eventsRegistry.model.Victim;
import com.eventsRegistry.model.Vehicle;

@Service
public class ParticipantService {
    private final ConcurrentMap<String, Participant> store = new ConcurrentHashMap<>();

    public ParticipantService() {}

    public Participant toModel(ParticipantDTO dto) {
        if (dto == null) return null;
        Participant p = new Participant(dto.getFirstName(), dto.getLastName(), dto.getPersonalId());
        // attach generated id to personalId? Models don't have id field; we'll keep mapping via store key
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
                    // fallback: create a GenericRole to preserve unknown role data
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

    public ParticipantDTO toDTO(Participant p) {
        if (p == null) return null;
        ParticipantDTO dto = new ParticipantDTO();
        dto.setFirstName(p.getFirstName());
        dto.setLastName(p.getLastName());
        dto.setPersonalId(p.getPersonalId());
        // find id in store by identity
        for (var entry : store.entrySet()) {
            if (entry.getValue() == p) {
                dto.setId(entry.getKey());
                break;
            }
        }
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

    // Persist participant in-memory and return generated id
    public String save(Participant p) {
        String id = UUID.randomUUID().toString();
        store.put(id, p);
        return id;
    }

    public Participant findById(String id) {
        return store.get(id);
    }

    public List<Participant> findAll() {
        return new ArrayList<>(store.values());
    }

}