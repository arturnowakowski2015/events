package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("INFO")
public class InfoIncident<T extends TelemetryData> extends Incident<T>  {
    private String metricName;
    private String value;
    private String unit;
    private T telemetry;

    public InfoIncident() {
        super(EventType.INFO, null);
    }

    public InfoIncident(T telemetry, String location, String metricName, String value, String unit) {
        super(EventType.INFO, location);
        this.telemetry=telemetry;
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