import {
    createIncident,
    deleteIncident,
    fetchIncident,
    fetchIncidents,
    updateIncident,
} from '../../api/incidents';
import type { IncidentDTO, IncidentPayload } from '../../api/types';
import { createHooks } from './createHooks';

const incidentsHooks = createHooks<IncidentDTO, IncidentPayload, string>({
    resource: 'incidents',
    getId: (incident) => incident.incidentId,
    fetchAll: fetchIncidents,
    fetchOne: fetchIncident,
    create: createIncident,
    update: updateIncident,
    remove: deleteIncident,
    optimistic: {
        create: (payload, tempId) => ({
            incidentId: tempId,
            dateTime: payload.dateTime,
            locationDescription: payload.locationDescription,
            eventType: payload.eventType,
            participants: payload.participants,
            telemetry: payload.telemetry,
        }),
        update: (id, payload, current) => ({
            ...(current ?? {
                incidentId: id,
                dateTime: '',
                locationDescription: '',
                eventType: 'GENERIC',
                participants: [],
                telemetry: null,
            }),
            incidentId: id,
            dateTime: payload.dateTime,
            locationDescription: payload.locationDescription,
            eventType: payload.eventType,
            participants: payload.participants,
            telemetry: payload.telemetry,
        }),
    },
});

export const incidentKeys = incidentsHooks.keys;

export const useIncidentsQuery = incidentsHooks.useListQuery;

export const useIncidentQuery = incidentsHooks.useDetailQuery;

export const useCreateIncidentMutation = incidentsHooks.useCreateMutation;

export const useUpdateIncidentMutation = incidentsHooks.useUpdateMutation;

export const useDeleteIncidentMutation = incidentsHooks.useDeleteMutation;