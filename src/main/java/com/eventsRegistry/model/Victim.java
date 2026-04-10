package com.eventsRegistry.model;

public class Victim extends ParticipantRole {
    private String damageDescription; 

    @Override
    public String getRoleName() { return "Victim"; }

    public String getDamageDescription() { return damageDescription; }
    public void setDamageDescription(String damageDescription) { this.damageDescription = damageDescription; }
}