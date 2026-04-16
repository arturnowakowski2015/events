package com.eventsRegistry.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Simple in-memory repository for Incident objects.
 */
public class Store {
    private final Map<String, Incident<? extends TelemetryData>> incidents = new ConcurrentHashMap<>();

    public Store() {
    }

    public void addIncident(Incident<? extends TelemetryData> incident) {
        if (incident == null) return;
        incidents.put(incident.getIncidentId(), incident);
    }

    public Incident<? extends TelemetryData> getById(String id) {
        return incidents.get(id);
    }

    public Incident<? extends TelemetryData> removeById(String id) {
        return incidents.remove(id);
    }

    public List<Incident<? extends TelemetryData>> listAll() {
        return new ArrayList<>(incidents.values());
    }

    public List<Incident<? extends TelemetryData>> listByEventType(EventType type) {
        if (type == null) return Collections.emptyList();
        return incidents.values().stream()
                .filter(i -> type.equals(i.getEventType()))
                .collect(Collectors.toList());
    }

    public long count() {
        return incidents.size();
    }
}