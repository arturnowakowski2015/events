package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("ACCIDENT")
public class AccidentIncident<T extends TelemetryData> extends Incident<T>  {
    private int vehiclesInvolved;
    private int casualties;
    private Severity severity;
    private T telemetry;

    public enum Severity { LOW, MEDIUM, HIGH }

    // No-arg constructor for Jackson
    public AccidentIncident() {
        super(EventType.ACCIDENT, null);
    }

    public AccidentIncident(T telemetry, String location, int vehiclesInvolved, int casualties, Severity severity) {
        super(EventType.ACCIDENT, location);
    	this.telemetry=telemetry;
        this.vehiclesInvolved = vehiclesInvolved;
        this.casualties = casualties;
        this.severity = severity != null ? severity : Severity.MEDIUM;
    }

    // getters/setters
    public int getVehiclesInvolved() { return vehiclesInvolved; }
    public void setVehiclesInvolved(int vehiclesInvolved) { this.vehiclesInvolved = vehiclesInvolved; }
    public int getCasualties() { return casualties; }
    public void setCasualties(int casualties) { this.casualties = casualties; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
}