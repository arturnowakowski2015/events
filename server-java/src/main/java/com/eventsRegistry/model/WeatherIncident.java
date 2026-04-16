package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("WEATHER")
public class WeatherIncident extends Incident<TelemetryData> {
    private String conditionType; // e.g., SNOW, FOG
    private String intensity;

    public WeatherIncident() {
        super(EventType.WEATHER, null);
    }

    public WeatherIncident(String location, String conditionType, String intensity) {
        super(EventType.WEATHER, location);
        this.conditionType = conditionType;
        this.intensity = intensity;
    }

    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }
    public String getIntensity() { return intensity; }
    public void setIntensity(String intensity) { this.intensity = intensity; }
}