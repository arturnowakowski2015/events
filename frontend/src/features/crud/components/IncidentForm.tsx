import type { ChangeEvent, FormEvent } from 'react';
import type { EventType, IncidentFormState, ParticipantDTO } from './incidentFormTypes';

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
            <div className="crud-form__grid">
                <div className="crud-field">
                    <label htmlFor={`${submitLabel}-date`}>Date and time</label>
                    <input id={`${submitLabel}-date`} type="datetime-local" value={form.dateTime} onChange={handleFieldChange('dateTime')} required />
                </div>
                <div className="crud-field">
                    <label htmlFor={`${submitLabel}-event-type`}>Event type</label>
                    <select id={`${submitLabel}-event-type`} value={form.eventType} onChange={handleFieldChange('eventType')}>
                        {eventTypeOptions.map((eventType) => (
                            <option key={eventType} value={eventType}>{eventType}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="crud-field">
                <label htmlFor={`${submitLabel}-location`}>Location</label>
                <input id={`${submitLabel}-location`} value={form.locationDescription} onChange={handleFieldChange('locationDescription')} required />
            </div>

            <div className="crud-group">
                <div className="crud-group__label">Embedded participants</div>
                {participants.length === 0 ? (
                    <div className="crud-empty">Create participants first if you want to embed them in incident payloads.</div>
                ) : (
                    <div className="crud-checkbox-grid">
                        {participants.map((participant) => (
                            <label className="crud-choice" key={participant.id}>
                                <input
                                    type="checkbox"
                                    checked={form.selectedParticipantIds.includes(participant.id)}
                                    onChange={() => onToggleParticipant(participant.id)}
                                />
                                <span>
                                    <strong>{participant.firstName} {participant.lastName}</strong>
                                    <span>{participant.id}</span>
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="crud-group">
                <div className="crud-form__grid">
                    <div className="crud-field">
                        <label htmlFor={`${submitLabel}-telemetry-type`}>Telemetry type</label>
                        <select id={`${submitLabel}-telemetry-type`} value={form.telemetryType} onChange={handleFieldChange('telemetryType')}>
                            <option value="NONE">None</option>
                            <option value="CRASH">Crash</option>
                            <option value="VEHICLE">Vehicle</option>
                        </select>
                    </div>
                    <div className="crud-field">
                        <label htmlFor={`${submitLabel}-precise-time`}>Precise time</label>
                        <input id={`${submitLabel}-precise-time`} type="datetime-local" value={form.preciseTime} onChange={handleFieldChange('preciseTime')} />
                    </div>
                    <div className="crud-field">
                        <label htmlFor={`${submitLabel}-speed`}>Speed at impact</label>
                        <input id={`${submitLabel}-speed`} type="number" step="0.1" value={form.speedAtImpact} onChange={handleFieldChange('speedAtImpact')} />
                    </div>
                    <div className="crud-field">
                        <label htmlFor={`${submitLabel}-gforce`}>G force</label>
                        <input id={`${submitLabel}-gforce`} type="number" step="0.1" value={form.gForce} onChange={handleFieldChange('gForce')} />
                    </div>
                    <div className="crud-field">
                        <label htmlFor={`${submitLabel}-latitude`}>Latitude</label>
                        <input id={`${submitLabel}-latitude`} type="number" step="0.0001" value={form.latitude} onChange={handleFieldChange('latitude')} />
                    </div>
                    <div className="crud-field">
                        <label htmlFor={`${submitLabel}-longitude`}>Longitude</label>
                        <input id={`${submitLabel}-longitude`} type="number" step="0.0001" value={form.longitude} onChange={handleFieldChange('longitude')} />
                    </div>
                </div>

                {form.telemetryType === 'CRASH' ? (
                    <div className="crud-form__grid">
                        <div className="crud-field">
                            <label htmlFor={`${submitLabel}-severity`}>Severity</label>
                            <input id={`${submitLabel}-severity`} type="number" value={form.severity} onChange={handleFieldChange('severity')} />
                        </div>
                        <div className="crud-field">
                            <label htmlFor={`${submitLabel}-notes`}>Notes</label>
                            <textarea id={`${submitLabel}-notes`} value={form.notes} onChange={handleFieldChange('notes')} />
                        </div>
                    </div>
                ) : null}

                {form.telemetryType === 'VEHICLE' ? (
                    <div className="crud-form__grid">
                        <div className="crud-field">
                            <label htmlFor={`${submitLabel}-vehicle-id`}>Vehicle ID</label>
                            <input id={`${submitLabel}-vehicle-id`} value={form.vehicleId} onChange={handleFieldChange('vehicleId')} />
                        </div>
                        <div className="crud-field">
                            <label htmlFor={`${submitLabel}-engine-rpm`}>Engine RPM</label>
                            <input id={`${submitLabel}-engine-rpm`} type="number" value={form.engineRpm} onChange={handleFieldChange('engineRpm')} />
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="crud-actions">
                <button className="crud-button" type="submit" disabled={pending}>{submitLabel}</button>
            </div>
        </form>
    );
}