export interface RoleDTO {
    roleName: string;
}

export interface VehicleDTO {
    vehicleId: string;
    make: string;
    model: string;
    licensePlate: string;
}

export interface ParticipantDTO {
    id: string;
    firstName: string;
    lastName: string;
    personalId: string;
    vehicle: VehicleDTO | null;
    roles: RoleDTO[];
}

export interface TelemetryDataDTO {
    speed: number;
    acceleration: number;
    timestamp: string;
}

export interface IncidentDTO {
    incidentId: string;
    dateTime: string;
    locationDescription: string;
    participants: ParticipantDTO[];
    telemetry: TelemetryDataDTO | null;
}
