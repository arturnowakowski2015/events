import {
    createIncident,
    deleteIncident,
    fetchIncident,
    fetchIncidents,
    updateIncident,
} from '../../../api/incidents';
import type { IncidentDTO, IncidentPayload } from '../../../api/types';
import { createCrudHooks } from './createCrudHooks';

const incidentsCrud = createCrudHooks<IncidentDTO, IncidentPayload, string>({
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

export const incidentKeys = incidentsCrud.keys;

export const useIncidentsQuery = incidentsCrud.useListQuery;

export const useIncidentQuery = incidentsCrud.useDetailQuery;

export const useCreateIncidentMutation = incidentsCrud.useCreateMutation;

export const useUpdateIncidentMutation = incidentsCrud.useUpdateMutation;

export const useDeleteIncidentMutation = incidentsCrud.useDeleteMutation;