package com.eventsRegistry.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "participants")
public class ParticipantEntity {
    @Id
    @Column(length = 36)
    private String id; // UUID string

    private String firstName;
    private String lastName;
    private String personalId;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "vehicle_id")
    private VehicleEntity vehicle;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "participant_id") // unidirectional FK in roles table
    private List<ParticipantRoleEntity> roles = new ArrayList<>();

    public ParticipantEntity() {}

    // getters / setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPersonalId() { return personalId; }
    public void setPersonalId(String personalId) { this.personalId = personalId; }

    public VehicleEntity getVehicle() { return vehicle; }
    public void setVehicle(VehicleEntity vehicle) { this.vehicle = vehicle; }

    public List<ParticipantRoleEntity> getRoles() { return roles; }
    public void setRoles(List<ParticipantRoleEntity> roles) { this.roles = roles; }
}
