package com.eventsRegistry.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Incident<T extends TelemetryData> {
    private String incidentId;
    private LocalDateTime dateTime;
    private String locationDescription;
    private List<Participant> participants = new ArrayList<>();
    private T telemetry;

    public Incident(String location) {
        this.incidentId = UUID.randomUUID().toString();
        this.dateTime = LocalDateTime.now();
        this.locationDescription = location;
    }

    public void addParticipant(Participant p) {
        this.participants.add(p);
    }

    public void setTelemetry(T telemetry) {
        this.telemetry = telemetry;
    }

    // Generic method to find participants by role
    public <R extends IRole> List<Participant> getParticipantsByRole(Class<R> roleType) {
        List<Participant> result = new ArrayList<>();
        for (Participant p : participants) {
            for (IRole r : p.getRoles()) {
                if (roleType.isInstance(r)) {
                    result.add(p);
                    break;
                }
            }
        }
        return result;
    }

    // --- Added getters ---
    public String getIncidentId() { return incidentId; }
    public LocalDateTime getDateTime() { return dateTime; }
    public String getLocationDescription() { return locationDescription; }
    public List<Participant> getParticipants() { return participants; }
    public T getTelemetry() { return telemetry; }
}