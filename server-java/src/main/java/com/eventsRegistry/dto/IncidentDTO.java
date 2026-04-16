package com.eventsRegistry.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.eventsRegistry.model.EventType;

public class IncidentDTO {
    private String incidentId;
    private LocalDateTime dateTime;
    private String locationDescription;
    private EventType eventType;
    private List<ParticipantDTO> participants = new ArrayList<>();
    private TelemetryDataDTO telemetry;

    public IncidentDTO() {}

    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getLocationDescription() { return locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }

    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }

    public List<ParticipantDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDTO> participants) { this.participants = participants; }

    public TelemetryDataDTO getTelemetry() { return telemetry; }
    public void setTelemetry(TelemetryDataDTO telemetry) { this.telemetry = telemetry; }
}