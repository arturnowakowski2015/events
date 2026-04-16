package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("INFO")
public class InfoIncident extends Incident<TelemetryData> {
    private String metricName;
    private String value;
    private String unit;

    public InfoIncident() {
        super(EventType.INFO, null);
    }

    public InfoIncident(String location, String metricName, String value, String unit) {
        super(EventType.INFO, location);
        this.metricName = metricName;
        this.value = value;
        this.unit = unit;
    }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}