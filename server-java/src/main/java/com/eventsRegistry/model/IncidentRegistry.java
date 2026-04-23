package com.eventsRegistry.model;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class IncidentRegistry {
    private Map<String, Incident<? extends TelemetryData>> incidents = new ConcurrentHashMap<>();

    public Map<String, Incident<? extends TelemetryData>> getIncidents() {
        return incidents;
    }

    public void setIncidents(Map<String, Incident<? extends TelemetryData>> incidents) {
        this.incidents = incidents;
    }
}
