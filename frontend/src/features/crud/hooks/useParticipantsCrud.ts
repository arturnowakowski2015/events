import {
    createParticipant,
    deleteParticipant,
    fetchParticipant,
    fetchParticipants,
    updateParticipant,
} from '../../../api/participants';
import type { ParticipantDTO, ParticipantPayload } from '../../../api/types';
import { createCrudHooks } from './createCrudHooks';

const participantsCrud = createCrudHooks<ParticipantDTO, ParticipantPayload, string>({
    resource: 'participants',
    getId: (participant) => participant.id,
    fetchAll: fetchParticipants,
    fetchOne: fetchParticipant,
    create: createParticipant,
    update: updateParticipant,
    remove: deleteParticipant,
    optimistic: {
        create: (payload, tempId) => ({
            id: tempId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            personalId: payload.personalId,
            roles: payload.roles,
            vehicle: payload.vehicle,
        }),
        update: (id, payload, current) => ({
            ...(current ?? {
                id,
                firstName: '',
                lastName: '',
                personalId: '',
                roles: [],
                vehicle: null,
            }),
            id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            personalId: payload.personalId,
            roles: payload.roles,
            vehicle: payload.vehicle,
        }),
    },
});

export const participantKeys = participantsCrud.keys;

export const useParticipantsQuery = participantsCrud.useListQuery;

export const useParticipantQuery = participantsCrud.useDetailQuery;

export const useCreateParticipantMutation = participantsCrud.useCreateMutation;

export const useUpdateParticipantMutation = participantsCrud.useUpdateMutation;

export const useDeleteParticipantMutation = participantsCrud.useDeleteMutation;