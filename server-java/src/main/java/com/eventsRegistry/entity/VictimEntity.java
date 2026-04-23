package com.eventsRegistry.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Victim")
public class VictimEntity extends ParticipantRoleEntity {
    private String damageDescription;

    public VictimEntity() {}

    public String getDamageDescription() { return damageDescription; }
    public void setDamageDescription(String damageDescription) { this.damageDescription = damageDescription; }
}
