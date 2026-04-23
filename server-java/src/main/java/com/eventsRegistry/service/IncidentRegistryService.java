package com.eventsRegistry.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.eventsRegistry.model.EventType;
import com.eventsRegistry.model.IRole;
import com.eventsRegistry.model.Incident;
import com.eventsRegistry.model.Participant;
import com.eventsRegistry.model.TelemetryData;

@Service
public class IncidentRegistryService {
    private final ConcurrentMap<String, Incident<? extends TelemetryData>> incidents = new ConcurrentHashMap<>();

    public void register(String id, Incident<? extends TelemetryData> incident) {
        if (id == null || id.isBlank() || incident == null) {
            return;
        }
        Incident<? extends TelemetryData> existing = incidents.get(id);
        if (existing != null && !existing.getClass().equals(incident.getClass())) {
            throw new IllegalArgumentException("Type mismatch for incident id: " + id);
        }
        incidents.put(id, incident);
    }

    public Incident<? extends TelemetryData> findById(String id) {
        return incidents.get(id);
    }

    public <T extends Incident<?>> T findById(String id, Class<T> targetClass) {
        Incident<?> incident = incidents.get(id);
        if (incident != null && targetClass.isInstance(incident)) {
            return targetClass.cast(incident);
        }
        return null;
    }

    public List<Incident<?>> findAll() {
        return new ArrayList<>(incidents.values());
    }

    public <T extends Incident<?>> List<T> findAllOfType(Class<T> targetClass) {
        List<T> out = new ArrayList<>();
        for (Incident<?> incident : incidents.values()) {
            if (targetClass.isInstance(incident)) {
                out.add(targetClass.cast(incident));
            }
        }
        return out;
    }

    public <T extends Incident<?>> List<T> findRangeSortedByDate(String incidentId, Class<T> targetClass) {
        return incidents.values().stream()
                .filter(targetClass::isInstance)
                .map(targetClass::cast)
                .filter(t -> incidentId.equals(t.getIncidentId()))
                .limit(4)
                .toList();
    }

    public <T extends Incident<?>> Map<IRole, List<T>> groupByRoleForIncidents(IRole roleFilter, Class<T> targetClass, Incident<?> excludeIncident) {
        Map<IRole, List<T>> result = new HashMap<>();
        List<T> filtered = findAllOfType(targetClass);

        for (T incident : filtered) {
            for (Participant participant : incident.getParticipants()) {
                for (IRole role : participant.getRoles()) {
                    if (roleFilter == null || roleFilter.getClass().isInstance(role)) {
                        result.computeIfAbsent(role, k -> new ArrayList<>()).add(incident);
                    }
                }
            }
        }

        if (excludeIncident != null) {
            result.values().forEach(list -> list.removeIf(i -> i.equals(excludeIncident)));
        }
        return result;
    }

    public List<Incident<? extends TelemetryData>> findByEventType(EventType type) {
        if (type == null) {
            return List.of();
        }
        List<Incident<? extends TelemetryData>> out = new ArrayList<>();
        for (Incident<? extends TelemetryData> incident : incidents.values()) {
            if (type.equals(incident.getEventType())) {
                out.add(incident);
            }
        }
        return out;
    }

    public Incident<? extends TelemetryData> removeById(String id) {
        return incidents.remove(id);
    }

    public long count() {
        return incidents.size();
    }
}