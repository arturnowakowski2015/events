import {
    createParticipant,
    deleteParticipant,
    fetchParticipant,
    fetchParticipants,
    updateParticipant,
} from '../../api/participants';
import type { ParticipantDTO, ParticipantPayload } from '../../api/types';
import { createHooks } from './createHooks';

const participantsHooks = createHooks<ParticipantDTO, ParticipantPayload, string>({
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

export const participantKeys = participantsHooks.keys;

export const useParticipantsQuery = participantsHooks.useListQuery;

export const useParticipantQuery = participantsHooks.useDetailQuery;

export const useCreateParticipantMutation = participantsHooks.useCreateMutation;

export const useUpdateParticipantMutation = participantsHooks.useUpdateMutation;

export const useDeleteParticipantMutation = participantsHooks.useDeleteMutation;