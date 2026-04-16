package com.eventsRegistry.model;

import java.util.ArrayList;
import java.util.List;

public class Participant extends Person implements IParticipant {
    private Vehicle vehicle; 
    private List<IRole> roles = new ArrayList<>();

    public Participant(String firstName, String lastName, String personalId) {
        super(firstName, lastName, personalId);
    }

    public void addRole(IRole role) {
        this.roles.add(role);
    }

    @Override public String getFirstName() { return firstName; }
    @Override public String getLastName() { return lastName; }
    @Override public String getPersonalId() { return personalId; }
    @Override public List<IRole> getRoles() { return roles; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
}