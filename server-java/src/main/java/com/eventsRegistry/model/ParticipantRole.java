package com.eventsRegistry.model;

public abstract class ParticipantRole implements IRole {
    protected String description;

    @Override
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}