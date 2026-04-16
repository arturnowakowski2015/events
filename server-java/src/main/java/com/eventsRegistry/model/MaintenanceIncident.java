package com.eventsRegistry.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("MAINTENANCE")
public class MaintenanceIncident extends Incident<TelemetryData> {
    private LocalDateTime scheduleStart;
    private LocalDateTime scheduleEnd;
    private String contractor;

    public MaintenanceIncident() {
        super(EventType.MAINTENANCE, null);
    }

    public MaintenanceIncident(String location, LocalDateTime scheduleStart, LocalDateTime scheduleEnd, String contractor) {
        super(EventType.MAINTENANCE, location);
        this.scheduleStart = scheduleStart;
        this.scheduleEnd = scheduleEnd;
        this.contractor = contractor;
    }

    // getters/setters
    public LocalDateTime getScheduleStart() { return scheduleStart; }
    public void setScheduleStart(LocalDateTime scheduleStart) { this.scheduleStart = scheduleStart; }
    public LocalDateTime getScheduleEnd() { return scheduleEnd; }
    public void setScheduleEnd(LocalDateTime scheduleEnd) { this.scheduleEnd = scheduleEnd; }
    public String getContractor() { return contractor; }
    public void setContractor(String contractor) { this.contractor = contractor; }
}