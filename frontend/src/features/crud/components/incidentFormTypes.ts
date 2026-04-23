import type {
    CrashTelemetryDTO,
    EventType,
    IncidentDTO,
    IncidentPayload,
    IncidentTelemetryDTO,
    ParticipantDTO,
    VehicleTelemetryDTO,
} from '../../../api/types';

export type { CrashTelemetryDTO, EventType, IncidentDTO, IncidentPayload, IncidentTelemetryDTO, ParticipantDTO, VehicleTelemetryDTO };

export type IncidentFormState = {
    dateTime: string;
    locationDescription: string;
    eventType: EventType;
    telemetryType: 'NONE' | 'CRASH' | 'VEHICLE';
    preciseTime: string;
    speedAtImpact: string;
    gForce: string;
    latitude: string;
    longitude: string;
    severity: string;
    notes: string;
    vehicleId: string;
    engineRpm: string;
    selectedParticipantIds: string[];
};