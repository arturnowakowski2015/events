package com.eventsRegistry.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "eventType"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = AccidentIncident.class, name = "ACCIDENT"),
        @JsonSubTypes.Type(value = MaintenanceIncident.class, name = "MAINTENANCE"),
        @JsonSubTypes.Type(value = TrafficIncident.class, name = "TRAFFIC"),
        @JsonSubTypes.Type(value = WeatherIncident.class, name = "WEATHER"),
        @JsonSubTypes.Type(value = AlertIncident.class, name = "ALERT"),
        @JsonSubTypes.Type(value = InfoIncident.class, name = "INFO"),
        @JsonSubTypes.Type(value = Incident.class, name = "GENERIC")
})
public class Incident<T extends TelemetryData> {
    private String incidentId;
    private LocalDateTime dateTime;
    private String locationDescription;
    private List<Participant> participants = new ArrayList<>();
    private T telemetry;
    private EventType eventType;

    // No-arg constructor for Jackson
    protected Incident() {
    }

    public Incident(EventType eventType, String location) {
        this.incidentId = UUID.randomUUID().toString();
        this.dateTime = LocalDateTime.now();
        this.locationDescription = location;
        this.eventType = eventType != null ? eventType : EventType.GENERIC;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public void addParticipant(Participant p) {
        this.participants.add(p);
    }

    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }

    public void setTelemetry(T telemetry) {
        this.telemetry = telemetry;
    }

    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }

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