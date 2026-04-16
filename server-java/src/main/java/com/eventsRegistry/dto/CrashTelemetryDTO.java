package com.eventsRegistry.dto;

import java.time.LocalDateTime;

public class CrashTelemetryDTO extends TelemetryDataDTO {
    private String incidentId;
    private int severity;
    private String notes;

    public CrashTelemetryDTO() { super(); }

    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }

    public int getSeverity() { return severity; }
    public void setSeverity(int severity) { this.severity = severity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
