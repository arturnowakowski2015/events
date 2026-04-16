package com.eventsRegistry.model;

import java.util.UUID;

public class CrashTelemetry extends TelemetryData {
    private UUID incidentId;
    private int severity; // 1..5
    private String notes;

    public CrashTelemetry(double speed, double gForce, double lat, double lon,
                          UUID incidentId, int severity, String notes) {
        super(TelemetryType.CRASH, speed, gForce, lat, lon);
        this.incidentId = incidentId != null ? incidentId : UUID.randomUUID();
        this.severity = severity;
        this.notes = notes;
    }

    public UUID getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(UUID incidentId) {
        this.incidentId = incidentId;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "CrashTelemetry{" +
                "incidentId=" + incidentId +
                ", severity=" + severity +
                ", notes='" + notes + '\'' +
                ", speedAtImpact=" + getSpeedAtImpact() +
                ", gForce=" + getgForce() +
                ", latitude=" + getLatitude() +
                ", longitude=" + getLongitude() +
                '}';
    }
}