export interface RoleDTO {
    roleName: string;
    description?: string;
}

export interface VehicleDTO {
    make: string;
    model: string;
    licensePlate: string;
    vin?: string;
    insurancePolicyNumber?: string;
}

export interface ParticipantDTO {
    id: string;
    firstName: string;
    lastName: string;
    personalId: string;
    vehicle: VehicleDTO | null;
    roles: RoleDTO[];
}

export type ParticipantPayload = Omit<ParticipantDTO, 'id'>;

export type EventType = 'GENERIC' | 'ACCIDENT' | 'MAINTENANCE' | 'TRAFFIC' | 'WEATHER' | 'ALERT' | 'INFO';

export interface TelemetryDataDTO {
    speedAtImpact: number;
    gForce: number;
    latitude: number;
    longitude: number;
    preciseTime: string;
}

export interface CrashTelemetryDTO extends TelemetryDataDTO {
    type: 'CRASH';
    incidentId?: string;
    severity: number;
    notes: string;
}

export interface VehicleTelemetryDTO extends TelemetryDataDTO {
    type: 'VEHICLE';
    vehicleId: string;
    engineRpm: number;
}

export type IncidentTelemetryDTO = TelemetryDataDTO | CrashTelemetryDTO | VehicleTelemetryDTO;

export interface IncidentDTO {
    incidentId: string;
    dateTime: string;
    locationDescription: string;
    eventType: EventType;
    participants: ParticipantDTO[];
    telemetry: IncidentTelemetryDTO | null;
}

export type IncidentPayload = Omit<IncidentDTO, 'incidentId'>;
