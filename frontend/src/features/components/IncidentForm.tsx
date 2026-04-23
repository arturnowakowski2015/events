import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import type { EventType, IncidentFormState, ParticipantDTO } from './incidentFormTypes';
import {
    IncidentFormGroup,
    ParticipantChoicesGrid,
} from '../componentsui/incident/IncidentFormCompound';

const eventTypeOptions: EventType[] = ['GENERIC', 'ACCIDENT', 'MAINTENANCE', 'TRAFFIC', 'WEATHER', 'ALERT', 'INFO'];

type IncidentFormProps = {
    form: IncidentFormState;
    participants: ParticipantDTO[];
    onFieldChange: (field: keyof IncidentFormState, value: string) => void;
    onToggleParticipant: (participantId: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
    pending: boolean;
};

type IncidentFormGridProps = {
    children: ReactNode;
};

type IncidentFormFieldProps = {
    htmlFor: string;
    label: string;
    children: ReactNode;
};

function IncidentFormGrid({ children }: IncidentFormGridProps) {
    return <div className="crud-form__grid">{children}</div>;
}

function IncidentFormField({ htmlFor, label, children }: IncidentFormFieldProps) {
    return (
        <div className="crud-field">
            <label htmlFor={htmlFor}>{label}</label>
            {children}
        </div>
    );
}

export function IncidentForm({
    form,
    participants,
    onFieldChange,
    onToggleParticipant,
    onSubmit,
    submitLabel,
    pending,
}: IncidentFormProps) {
    const handleFieldChange =
        (field: keyof IncidentFormState) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                onFieldChange(field, event.target.value);
            };

    return (
        <form className="crud-form" onSubmit={onSubmit}>
            <IncidentFormGrid>
                <IncidentFormField htmlFor={`${submitLabel}-date`} label="Date and time">
                    <input id={`${submitLabel}-date`} type="datetime-local" value={form.dateTime} onChange={handleFieldChange('dateTime')} required />
                </IncidentFormField>
                <IncidentFormField htmlFor={`${submitLabel}-event-type`} label="Event type">
                    <select id={`${submitLabel}-event-type`} value={form.eventType} onChange={handleFieldChange('eventType')}>
                        {eventTypeOptions.map((eventType) => (
                            <option key={eventType} value={eventType}>{eventType}</option>
                        ))}
                    </select>
                </IncidentFormField>
            </IncidentFormGrid>

            <IncidentFormField htmlFor={`${submitLabel}-location`} label="Location">
                <input id={`${submitLabel}-location`} value={form.locationDescription} onChange={handleFieldChange('locationDescription')} required />
            </IncidentFormField>

            <IncidentFormGroup>
                <IncidentFormGroup.Label>Embedded participants</IncidentFormGroup.Label>
                {participants.length === 0 ? (
                    <div className="crud-empty">Create participants first if you want to embed them in incident payloads.</div>
                ) : (
                    <ParticipantChoicesGrid>
                        {participants.map((participant) => (
                            <ParticipantChoicesGrid.Choice key={participant.id}>
                                <input
                                    type="checkbox"
                                    title={`Select participant ${participant.firstName} ${participant.lastName}`}
                                    checked={form.selectedParticipantIds.includes(participant.id)}
                                    onChange={() => onToggleParticipant(participant.id)}
                                />
                                <span>
                                    <strong>{participant.firstName} {participant.lastName}</strong>
                                    <span>{participant.id}</span>
                                </span>
                            </ParticipantChoicesGrid.Choice>
                        ))}
                    </ParticipantChoicesGrid>
                )}
            </IncidentFormGroup>

            <IncidentFormGroup>
                <IncidentFormGrid>
                    <IncidentFormField htmlFor={`${submitLabel}-telemetry-type`} label="Telemetry type">
                        <select id={`${submitLabel}-telemetry-type`} value={form.telemetryType} onChange={handleFieldChange('telemetryType')}>
                            <option value="NONE">None</option>
                            <option value="CRASH">Crash</option>
                            <option value="VEHICLE">Vehicle</option>
                        </select>
                    </IncidentFormField>
                    <IncidentFormField htmlFor={`${submitLabel}-precise-time`} label="Precise time">
                        <input id={`${submitLabel}-precise-time`} type="datetime-local" value={form.preciseTime} onChange={handleFieldChange('preciseTime')} />
                    </IncidentFormField>
                    <IncidentFormField htmlFor={`${submitLabel}-speed`} label="Speed at impact">
                        <input id={`${submitLabel}-speed`} type="number" step="0.1" value={form.speedAtImpact} onChange={handleFieldChange('speedAtImpact')} />
                    </IncidentFormField>
                    <IncidentFormField htmlFor={`${submitLabel}-gforce`} label="G force">
                        <input id={`${submitLabel}-gforce`} type="number" step="0.1" value={form.gForce} onChange={handleFieldChange('gForce')} />
                    </IncidentFormField>
                    <IncidentFormField htmlFor={`${submitLabel}-latitude`} label="Latitude">
                        <input id={`${submitLabel}-latitude`} type="number" step="0.0001" value={form.latitude} onChange={handleFieldChange('latitude')} />
                    </IncidentFormField>
                    <IncidentFormField htmlFor={`${submitLabel}-longitude`} label="Longitude">
                        <input id={`${submitLabel}-longitude`} type="number" step="0.0001" value={form.longitude} onChange={handleFieldChange('longitude')} />
                    </IncidentFormField>
                </IncidentFormGrid>

                {form.telemetryType === 'CRASH' ? (
                    <IncidentFormGrid>
                        <IncidentFormField htmlFor={`${submitLabel}-severity`} label="Severity">
                            <input id={`${submitLabel}-severity`} type="number" value={form.severity} onChange={handleFieldChange('severity')} />
                        </IncidentFormField>
                        <IncidentFormField htmlFor={`${submitLabel}-notes`} label="Notes">
                            <textarea id={`${submitLabel}-notes`} value={form.notes} onChange={handleFieldChange('notes')} />
                        </IncidentFormField>
                    </IncidentFormGrid>
                ) : null}

                {form.telemetryType === 'VEHICLE' ? (
                    <IncidentFormGrid>
                        <IncidentFormField htmlFor={`${submitLabel}-vehicle-id`} label="Vehicle ID">
                            <input id={`${submitLabel}-vehicle-id`} value={form.vehicleId} onChange={handleFieldChange('vehicleId')} />
                        </IncidentFormField>
                        <IncidentFormField htmlFor={`${submitLabel}-engine-rpm`} label="Engine RPM">
                            <input id={`${submitLabel}-engine-rpm`} type="number" value={form.engineRpm} onChange={handleFieldChange('engineRpm')} />
                        </IncidentFormField>
                    </IncidentFormGrid>
                ) : null}
            </IncidentFormGroup>

            <div className="crud-actions">
                <button className="crud-button" type="submit" disabled={pending}>{submitLabel}</button>
            </div>
        </form>
    );
}