package com.eventsRegistry.model;

public class Perpetrator extends ParticipantRole {
    private String ticketNumber;  

    @Override
    public String getRoleName() { return "Perpetrator"; }
    
    
    
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
}