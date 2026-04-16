package com.eventsRegistry.model;

public class Vehicle {
    private String make; // Marka
    private String model;
    private String licensePlate; // Nr rejestracyjny
    private String vin;
    private String insurancePolicyNumber; // Nr polisy OC

    public Vehicle(String make, String licensePlate) {
        this.make = make;
        this.licensePlate = licensePlate;
    }

	public String getMake() {
		return make;
	}

	public void setMake(String make) {
		this.make = make;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getLicensePlate() {
		return licensePlate;
	}

	public void setLicensePlate(String licensePlate) {
		this.licensePlate = licensePlate;
	}

	public String getVin() {
		return vin;
	}

	public void setVin(String vin) {
		this.vin = vin;
	}

	public String getInsurancePolicyNumber() {
		return insurancePolicyNumber;
	}

	public void setInsurancePolicyNumber(String insurancePolicyNumber) {
		this.insurancePolicyNumber = insurancePolicyNumber;
	}
    
    // Getters and setters...
}


 