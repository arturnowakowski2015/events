package com.eventsRegistry.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ParticipantDTO {
	private UUID id; 
    private String firstName;
    private String lastName;
    private String personalId;
    private VehicleDTO vehicle;
    private List<RoleDTO> roles = new ArrayList<>();

    public ParticipantDTO() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPersonalId() { return personalId; }
    public void setPersonalId(String personalId) { this.personalId = personalId; }

    public VehicleDTO getVehicle() { return vehicle; }
    public void setVehicle(VehicleDTO vehicle) { this.vehicle = vehicle; }

    public List<RoleDTO> getRoles() { return roles; }
    public void setRoles(List<RoleDTO> roles) { this.roles = roles; }
}