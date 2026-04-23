package com.eventsRegistry.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.eventsRegistry.dto.CrashTelemetryDTO;
import com.eventsRegistry.dto.IncidentDTO;
import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.dto.TelemetryDataDTO;
import com.eventsRegistry.dto.VehicleTelemetryDTO;
import com.eventsRegistry.model.CrashTelemetry;
import com.eventsRegistry.model.IRole;
import com.eventsRegistry.model.Incident;
import com.eventsRegistry.model.Participant;
import com.eventsRegistry.model.TelemetryData;
import com.eventsRegistry.model.VehicleTelemetry;

@Service
public class IncidentService {
    private final ParticipantService participantService;
    private final IncidentRegistryService incidentRegistryService;

    public IncidentService(ParticipantService participantService, IncidentRegistryService incidentRegistryService) {
        this.participantService = participantService;
        this.incidentRegistryService = incidentRegistryService;
    }

    public Incident<TelemetryData> toModel(IncidentDTO dto) {
        if (dto == null) return null;
        // Create incident with event type and location
        Incident<TelemetryData> inc = new Incident<>(dto.getEventType(), dto.getLocationDescription());
        // Preserve provided id/dateTime when available
        if (dto.getIncidentId() != null) inc.setIncidentId(dto.getIncidentId());
        if (dto.getDateTime() != null) inc.setDateTime(dto.getDateTime());

        if (dto.getParticipants() != null) {
            for (ParticipantDTO pd : dto.getParticipants()) {
                Participant p = participantService.toModel(pd);
                inc.addParticipant(p);
            }
        }
        TelemetryDataDTO td = dto.getTelemetry();
        if (td != null) {
            TelemetryData t = null;
            if (td instanceof CrashTelemetryDTO) {
                CrashTelemetryDTO c = (CrashTelemetryDTO) td;
                t = new CrashTelemetry(c.getSpeedAtImpact(), c.getgForce(), c.getLatitude(), c.getLongitude(),
                        null, c.getSeverity(), c.getNotes());
                t.setPreciseTime(c.getPreciseTime());
            } else if (td instanceof VehicleTelemetryDTO) {
                VehicleTelemetryDTO v = (VehicleTelemetryDTO) td;
                t = new VehicleTelemetry(v.getVehicleId(), v.getSpeedAtImpact(), v.getgForce(), v.getLatitude(), v.getLongitude(), v.getEngineRpm());
                t.setPreciseTime(v.getPreciseTime());
            } else {
                // fallback to a generic TelemetryData implementation: use an anonymous subclass
                TelemetryData generic = new TelemetryData(null, td.getSpeedAtImpact(), td.getgForce(), td.getLatitude(), td.getLongitude()) {};
                generic.setPreciseTime(td.getPreciseTime());
                t = generic;
            }
            inc.setTelemetry(t);
        }
        return inc;
    }

    public IncidentDTO toDTO(Incident<?> inc) {
        if (inc == null) return null;
        IncidentDTO dto = new IncidentDTO();
        dto.setIncidentId(inc.getIncidentId());
        dto.setDateTime(inc.getDateTime());
        dto.setLocationDescription(inc.getLocationDescription());
        if (inc.getParticipants() != null) {
            List<ParticipantDTO> list = new ArrayList<>();
            for (Participant p : inc.getParticipants()) {
                list.add(participantService.toDTO(p));
            }
            dto.setParticipants(list);
        }
        if (inc.getTelemetry() != null) {
            TelemetryData t = inc.getTelemetry();
            if (t instanceof CrashTelemetry) {
                CrashTelemetry c = (CrashTelemetry) t;
                CrashTelemetryDTO ct = new CrashTelemetryDTO();
                ct.setSpeedAtImpact(c.getSpeedAtImpact());
                ct.setgForce(c.getgForce());
                ct.setLatitude(c.getLatitude());
                ct.setLongitude(c.getLongitude());
                ct.setPreciseTime(c.getPreciseTime());
                ct.setSeverity(c.getSeverity());
                ct.setNotes(c.getNotes());
                ct.setIncidentId(c.getIncidentId().toString());
                dto.setTelemetry(ct);
            } else if (t instanceof VehicleTelemetry) {
                VehicleTelemetry v = (VehicleTelemetry) t;
                VehicleTelemetryDTO vt = new VehicleTelemetryDTO();
                vt.setSpeedAtImpact(v.getSpeedAtImpact());
                vt.setgForce(v.getgForce());
                vt.setLatitude(v.getLatitude());
                vt.setLongitude(v.getLongitude());
                vt.setPreciseTime(v.getPreciseTime());
                vt.setVehicleId(v.getVehicleId());
                vt.setEngineRpm(v.getEngineRpm());
                dto.setTelemetry(vt);
            } else {
                TelemetryDataDTO tdto = new TelemetryDataDTO();
                tdto.setSpeedAtImpact(t.getSpeedAtImpact());
                tdto.setgForce(t.getgForce());
                tdto.setLatitude(t.getLatitude());
                tdto.setLongitude(t.getLongitude());
                tdto.setPreciseTime(t.getPreciseTime());
                dto.setTelemetry(tdto);
            }
        }
        return dto;
    }

    public void save(Incident<TelemetryData> inc) {
        incidentRegistryService.register(inc.getIncidentId(), inc);
    }

    public Incident<TelemetryData> save(String id, Incident<TelemetryData> incident) {
        if (id == null || id.isBlank() || incident == null) {
            return null;
        }
        incident.setIncidentId(id);
        incidentRegistryService.register(id, incident);
        return incident;
    }

    public Incident<TelemetryData> findById(String id) {
        Incident<? extends TelemetryData> inc = incidentRegistryService.findById(id);
        if (inc == null) {
            return null;
        }
        @SuppressWarnings("unchecked")
        Incident<TelemetryData> typed = (Incident<TelemetryData>) inc;
        return typed;
    }
 
    public <T extends Incident<?>> T findById(String id, Class<T> targetClass) {
        return incidentRegistryService.findById(id, targetClass);
    }
    
    
    public List<Incident<?>> findAll() {
        return incidentRegistryService.findAll();
    }

    public <T extends Incident<?>> List<T> getByCategory(Class<T> clazz)
    {
    	return incidentRegistryService.findAllOfType(clazz);
    }

    public boolean deleteById(String id) {
        if (id == null || id.isBlank()) {
            return false;
        }
        return incidentRegistryService.removeById(id) != null;
    }

    // Business query previously hosted in Incident model.
    public <R extends IRole> List<Participant> getParticipantsByRole(Incident<?> incident, Class<R> roleType) {
        List<Participant> result = new ArrayList<>();
        if (incident == null || roleType == null) {
            return result;
        }
        for (Participant p : incident.getParticipants()) {
            for (IRole r : p.getRoles()) {
                if (roleType.isInstance(r)) {
                    result.add(p);
                    break;
                }
            }
        }
        return result;
    }
}