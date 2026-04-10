package com.eventsRegistry.model;

import java.time.LocalDateTime;

public abstract class TelemetryData {
    private TelemetryType telemetryType = TelemetryType.GENERIC;
    private double speedAtImpact; 
    private double gForce;    
    private double latitude;
    private double longitude;
    private LocalDateTime preciseTime;

    public TelemetryData(TelemetryType type, double speed, double gForce, double lat, double lon) {
        this.telemetryType = type != null ? type : TelemetryType.GENERIC;
        this.speedAtImpact = speed;
        this.gForce = gForce;
        this.latitude = lat;
        this.longitude = lon;
        this.preciseTime = LocalDateTime.now();
    }
    // Getters...

    public TelemetryType getTelemetryType() {
        return telemetryType;
    }

    public void setTelemetryType(TelemetryType telemetryType) {
        this.telemetryType = telemetryType;
    }

	public double getSpeedAtImpact() {
		return speedAtImpact;
	}

	public void setSpeedAtImpact(double speedAtImpact) {
		this.speedAtImpact = speedAtImpact;
	}

	public double getgForce() {
		return gForce;
	}

	public void setgForce(double gForce) {
		this.gForce = gForce;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public LocalDateTime getPreciseTime() {
		return preciseTime;
	}

	public void setPreciseTime(LocalDateTime preciseTime) {
		this.preciseTime = preciseTime;
	}
}