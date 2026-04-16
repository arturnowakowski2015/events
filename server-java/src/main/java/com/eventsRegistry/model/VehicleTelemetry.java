package com.eventsRegistry.model;

public class VehicleTelemetry extends TelemetryData {
    private String vehicleId;
    private int engineRpm;

    public VehicleTelemetry(String vehicleId, double speed, double gForce, double lat, double lon, int engineRpm) {
        super(TelemetryType.VEHICLE, speed, gForce, lat, lon);
        this.vehicleId = vehicleId;
        this.engineRpm = engineRpm;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public int getEngineRpm() {
        return engineRpm;
    }

    public void setEngineRpm(int engineRpm) {
        this.engineRpm = engineRpm;
    }

    @Override
    public String toString() {
        return "VehicleTelemetry{" +
                "vehicleId='" + vehicleId + '\'' +
                ", engineRpm=" + engineRpm +
                ", speedAtImpact=" + getSpeedAtImpact() +
                ", gForce=" + getgForce() +
                ", latitude=" + getLatitude() +
                ", longitude=" + getLongitude() +
                '}';
    }
}