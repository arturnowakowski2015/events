import type { FormEvent } from 'react';
import type { ParticipantFormState } from './participantFormTypes';
import { ParticipantFormGroup, ParticipantFormLayout } from '../componentsui/participant/ParticipantFormCompound';

type ParticipantFormProps = {
    mode: 'create' | 'update';
    form: ParticipantFormState;
    participantId?: string;
    onParticipantIdChange?: (value: string) => void;
    onFieldChange: (field: keyof ParticipantFormState, value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
    pending: boolean;
    onReset?: () => void;
};

export function ParticipantForm({
    mode,
    form,
    participantId,
    onParticipantIdChange,
    onFieldChange,
    onSubmit,
    submitLabel,
    pending,
    onReset,
}: ParticipantFormProps) {
    const prefix = mode === 'create' ? 'participant-create' : 'participant-update';

    return (
        <ParticipantFormLayout onSubmit={onSubmit}>
            {mode === 'update' ? (
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-id`}>Participant ID</label>
                    <input
                        id={`${prefix}-id`}
                        value={participantId ?? ''}
                        onChange={(event) => onParticipantIdChange?.(event.target.value)}
                        placeholder="Select from the table or paste an id"
                        required
                    />
                </ParticipantFormLayout.Field>
            ) : null}

            <ParticipantFormLayout.Grid>
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-first-name`}>First name</label>
                    <input id={`${prefix}-first-name`} value={form.firstName} onChange={(event) => onFieldChange('firstName', event.target.value)} required />
                </ParticipantFormLayout.Field>
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-last-name`}>Last name</label>
                    <input id={`${prefix}-last-name`} value={form.lastName} onChange={(event) => onFieldChange('lastName', event.target.value)} required />
                </ParticipantFormLayout.Field>
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-personal-id`}>Personal ID</label>
                    <input id={`${prefix}-personal-id`} value={form.personalId} onChange={(event) => onFieldChange('personalId', event.target.value)} />
                </ParticipantFormLayout.Field>
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-role-name`}>Role</label>
                    <input id={`${prefix}-role-name`} value={form.roleName} onChange={(event) => onFieldChange('roleName', event.target.value)} placeholder="Victim, Perpetrator…" />
                </ParticipantFormLayout.Field>
            </ParticipantFormLayout.Grid>

            <ParticipantFormGroup>
                <ParticipantFormGroup.Label>Vehicle payload</ParticipantFormGroup.Label>
                <ParticipantFormLayout.Grid>
                    <ParticipantFormLayout.Field>
                        <label htmlFor={`${prefix}-vehicle-make`}>Make</label>
                        <input id={`${prefix}-vehicle-make`} value={form.vehicleMake} onChange={(event) => onFieldChange('vehicleMake', event.target.value)} />
                    </ParticipantFormLayout.Field>
                    <ParticipantFormLayout.Field>
                        <label htmlFor={`${prefix}-vehicle-model`}>Model</label>
                        <input id={`${prefix}-vehicle-model`} value={form.vehicleModel} onChange={(event) => onFieldChange('vehicleModel', event.target.value)} />
                    </ParticipantFormLayout.Field>
                    <ParticipantFormLayout.Field>
                        <label htmlFor={`${prefix}-license-plate`}>License plate</label>
                        <input id={`${prefix}-license-plate`} value={form.licensePlate} onChange={(event) => onFieldChange('licensePlate', event.target.value)} />
                    </ParticipantFormLayout.Field>
                    <ParticipantFormLayout.Field>
                        <label htmlFor={`${prefix}-vin`}>VIN</label>
                        <input id={`${prefix}-vin`} value={form.vin} onChange={(event) => onFieldChange('vin', event.target.value)} />
                    </ParticipantFormLayout.Field>
                </ParticipantFormLayout.Grid>
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-role-description`}>Role description</label>
                    <textarea id={`${prefix}-role-description`} value={form.roleDescription} onChange={(event) => onFieldChange('roleDescription', event.target.value)} />
                </ParticipantFormLayout.Field>
                <ParticipantFormLayout.Field>
                    <label htmlFor={`${prefix}-policy`}>Insurance policy</label>
                    <input id={`${prefix}-policy`} value={form.insurancePolicyNumber} onChange={(event) => onFieldChange('insurancePolicyNumber', event.target.value)} />
                </ParticipantFormLayout.Field>
            </ParticipantFormGroup>

            <div className="crud-actions">
                <button className="crud-button" type="submit" disabled={pending}>{submitLabel}</button>
                {onReset ? (
                    <button className="crud-button crud-button--ghost" type="button" onClick={onReset}>
                        Reset
                    </button>
                ) : null}
            </div>
        </ParticipantFormLayout>
    );
}