package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("WEATHER")
public class WeatherIncident<T extends TelemetryData> extends Incident<T> {
    private String conditionType; // e.g., SNOW, FOG
    private String intensity;
    private T telemetry;

    public WeatherIncident() {
        super(EventType.WEATHER, null);
    }

    public WeatherIncident(T telemetry, String location, String conditionType, String intensity) {
        super(EventType.WEATHER, location);
        this.telemetry=telemetry;
        this.conditionType = conditionType;
        this.intensity = intensity;
    }

    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }
    public String getIntensity() { return intensity; }
    public void setIntensity(String intensity) { this.intensity = intensity; }
}