package com.eventsRegistry.dto;

public class VehicleTelemetryDTO extends TelemetryDataDTO {
    private String vehicleId;
    private int engineRpm;

    public VehicleTelemetryDTO() { super(); }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public int getEngineRpm() { return engineRpm; }
    public void setEngineRpm(int engineRpm) { this.engineRpm = engineRpm; }
}
