package com.eventsRegistry.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Perpetrator")
public class PerpetratorEntity extends ParticipantRoleEntity {
    private String ticketNumber;

    public PerpetratorEntity() {}

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
}
