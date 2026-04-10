package com.eventsRegistry.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", include = JsonTypeInfo.As.PROPERTY)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CrashTelemetryDTO.class, name = "CRASH"),
        @JsonSubTypes.Type(value = VehicleTelemetryDTO.class, name = "VEHICLE")
})


//for deserialisation to CrashTelemetryDTO{
//	  "telemetry": {
//	    "type": "CRASH",
//	    "speedAtImpact": 80.5,
//	    "gForce": 4.2,
//	    "latitude": 50.06,
//	    "longitude": 19.94,
//	    "preciseTime": "2026-04-10T12:34:56",
//	    "incidentId": "123e4567-e89b-12d3-a456-426614174000",
//	    "severity": 4,
//	    "notes": "front impact"
//	  }
//	}

public class TelemetryDataDTO {
    private double speedAtImpact;
    private double gForce;
    private double latitude;
    private double longitude;
    private LocalDateTime preciseTime;

    public TelemetryDataDTO() {}

    public double getSpeedAtImpact() { return speedAtImpact; }
    public void setSpeedAtImpact(double speedAtImpact) { this.speedAtImpact = speedAtImpact; }

    public double getgForce() { return gForce; }
    public void setgForce(double gForce) { this.gForce = gForce; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public LocalDateTime getPreciseTime() { return preciseTime; }
    public void setPreciseTime(LocalDateTime preciseTime) { this.preciseTime = preciseTime; }
}




