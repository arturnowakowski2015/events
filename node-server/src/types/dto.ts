export interface RoleDTO {
    roleId?: string;
    roleName: string;
    description?: string;
}

export interface VehicleDTO {
    make?: string;
    model?: string;
    licensePlate?: string;
    vin?: string;
    insurancePolicyNumber?: string;
}

export interface ParticipantDTO {
    id?: string;
    firstName: string;
    lastName: string;
    personalId?: string;
    vehicle?: VehicleDTO | null;
    roles: RoleDTO[];
}

export interface TelemetryDataDTO {
    type: 'CRASH' | 'VEHICLE';
    speedAtImpact?: number;
    gForce?: number;
    latitude?: number;
    longitude?: number;
    preciseTime?: string;
    // VEHICLE-specific
    speed?: number;
    rpm?: number;
    fuelLevel?: number;
}

export interface IncidentDTO {
    incidentId?: string;
    dateTime: string;
    locationDescription?: string;
    eventType?: string;
    participants: ParticipantDTO[];
    telemetry?: TelemetryDataDTO | null;
}
