package com.eventsRegistry.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "incidents")
public class IncidentEntity {
    @Id
    private String id; // UUID string

    private Instant dateTime;
    @Column(length = 1000)
    private String locationDescription;

    // Simple flattened telemetry fields (łatwiejsze do rozpoczęcia):
    private Double speedAtImpact;
    private Double gForce;
    private Double latitude;
    private Double longitude;
    private String telemetryType; // e.g. "CRASH", "VEHICLE"
    private Integer severity;
    @Column(length = 2000)
    private String notes;
    private String vehicleId;
    private Integer engineRpm;
    private Instant preciseTime;

    @ManyToMany
    @JoinTable(name = "incident_participants",
        joinColumns = @JoinColumn(name = "incident_id"),
        inverseJoinColumns = @JoinColumn(name = "participant_id"))
    private Set<ParticipantEntity> participants = new HashSet<>();

    // getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Instant getDateTime() { return dateTime; }
    public void setDateTime(Instant dateTime) { this.dateTime = dateTime; }
    public String getLocationDescription() { return locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }
    public Double getSpeedAtImpact() { return speedAtImpact; }
    public void setSpeedAtImpact(Double speedAtImpact) { this.speedAtImpact = speedAtImpact; }
    public Double getgForce() { return gForce; }
    public void setgForce(Double gForce) { this.gForce = gForce; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getTelemetryType() { return telemetryType; }
    public void setTelemetryType(String telemetryType) { this.telemetryType = telemetryType; }
    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public Integer getEngineRpm() { return engineRpm; }
    public void setEngineRpm(Integer engineRpm) { this.engineRpm = engineRpm; }
    public Instant getPreciseTime() { return preciseTime; }
    public void setPreciseTime(Instant preciseTime) { this.preciseTime = preciseTime; }
    public Set<ParticipantEntity> getParticipants() { return participants; }
    public void setParticipants(Set<ParticipantEntity> participants) { this.participants = participants; }
}
