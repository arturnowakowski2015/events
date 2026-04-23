import type { ParticipantDTO, ParticipantPayload } from '../../api/types';

export type ParticipantFormState = {
    firstName: string;
    lastName: string;
    personalId: string;
    roleName: string;
    roleDescription: string;
    vehicleMake: string;
    vehicleModel: string;
    licensePlate: string;
    vin: string;
    insurancePolicyNumber: string;
};

export const emptyParticipantForm: ParticipantFormState = {
    firstName: '',
    lastName: '',
    personalId: '',
    roleName: '',
    roleDescription: '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    vin: '',
    insurancePolicyNumber: '',
};

export function toParticipantFormState(participant: ParticipantDTO): ParticipantFormState {
    const role = participant.roles[0];

    return {
        firstName: participant.firstName,
        lastName: participant.lastName,
        personalId: participant.personalId,
        roleName: role?.roleName ?? '',
        roleDescription: role?.description ?? '',
        vehicleMake: participant.vehicle?.make ?? '',
        vehicleModel: participant.vehicle?.model ?? '',
        licensePlate: participant.vehicle?.licensePlate ?? '',
        vin: participant.vehicle?.vin ?? '',
        insurancePolicyNumber: participant.vehicle?.insurancePolicyNumber ?? '',
    };
}

export function buildParticipantPayload(form: ParticipantFormState): ParticipantPayload {
    const hasVehicle = [form.vehicleMake, form.vehicleModel, form.licensePlate, form.vin, form.insurancePolicyNumber]
        .some((value) => value.trim().length > 0);

    return {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        personalId: form.personalId.trim(),
        roles: form.roleName.trim()
            ? [{ roleName: form.roleName.trim(), description: form.roleDescription.trim() || undefined }]
            : [],
        vehicle: hasVehicle
            ? {
                make: form.vehicleMake.trim(),
                model: form.vehicleModel.trim(),
                licensePlate: form.licensePlate.trim(),
                vin: form.vin.trim() || undefined,
                insurancePolicyNumber: form.insurancePolicyNumber.trim() || undefined,
            }
            : null,
    };
}

export function formatVehicle(participant: ParticipantDTO) {
    if (!participant.vehicle) {
        return 'No vehicle';
    }

    const vehicle = participant.vehicle;
    return [vehicle.make, vehicle.model, vehicle.licensePlate].filter(Boolean).join(' · ');
}

export function formatRoles(participant: ParticipantDTO) {
    if (participant.roles.length === 0) {
        return ['No roles'];
    }

    return participant.roles.map((role) => role.description
        ? `${role.roleName}: ${role.description}`
        : role.roleName);
}