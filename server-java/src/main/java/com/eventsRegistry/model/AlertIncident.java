package com.eventsRegistry.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("ALERT")
public class AlertIncident<T extends TelemetryData> extends Incident<T>  {
	private T telemetry;
    private String priority; // could be enum
    private String actionRequired;

    public AlertIncident() {
        super(EventType.ALERT, null);
    }

    public AlertIncident(T telemetry, String location, String priority, String actionRequired) {
        super(EventType.ALERT, location);
        this.telemetry=telemetry;
        this.priority = priority;
        this.actionRequired = actionRequired;
    }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getActionRequired() { return actionRequired; }
    public void setActionRequired(String actionRequired) { this.actionRequired = actionRequired; }
}