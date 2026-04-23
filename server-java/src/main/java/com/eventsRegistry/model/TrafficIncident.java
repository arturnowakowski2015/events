package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
 @JsonTypeName("TRAFFIC")
public class TrafficIncident<T extends TelemetryData> extends Incident<T> {
    private int lengthMeters;
    private int delayEstimateMinutes;
    private String cause;
    private T telemetry;

    public TrafficIncident() {
        super(EventType.TRAFFIC, null);
    }

    public TrafficIncident(T telemetry,String location, int lengthMeters, int delayEstimateMinutes, String cause) {
        super(EventType.TRAFFIC, location);
        this.telemetry=telemetry;
        this.lengthMeters = lengthMeters;
        this.delayEstimateMinutes = delayEstimateMinutes;
        this.cause = cause;
    }

    // getters/setters
    public int getLengthMeters() { return lengthMeters; }
    public void setLengthMeters(int lengthMeters) { this.lengthMeters = lengthMeters; }
    public int getDelayEstimateMinutes() { return delayEstimateMinutes; }
    public void setDelayEstimateMinutes(int delayEstimateMinutes) { this.delayEstimateMinutes = delayEstimateMinutes; }
    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }
}