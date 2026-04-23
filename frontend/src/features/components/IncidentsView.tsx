import type { FormEvent } from 'react';
import type {
    CrashTelemetryDTO,
    IncidentDTO,
    IncidentFormState,
    IncidentPayload,
    IncidentTelemetryDTO,
    ParticipantDTO,
    VehicleTelemetryDTO,
} from './incidentFormTypes';
import {
    useCreateIncidentMutation,
    useDeleteIncidentMutation,
    useIncidentQuery,
    useIncidentsQuery,
    useUpdateIncidentMutation,
} from '../hooks/useIncidents';
import { useParticipantsQuery } from '../hooks/useParticipants';
import { useActionState } from '../hooks/useActionState';
import { ApiPanel } from './ApiPanel';
import { IncidentForm } from './IncidentForm';
import { GenericTable, type ColumnDef } from '../../components/GenericTable';
import { IncidentFormGroup } from '../componentsui/incident/IncidentFormCompound';
import { IncidentInlineForm, IncidentMetrics } from '../componentsui/incident/IncidentsViewCompound';
import { Hero } from '../componentsui/Hero';
import { ApiPanelMenu } from '../componentsui/ApiPanelMenu';
import { useState } from 'react';
import './CrudWorkspace.css';

const emptyIncidentForm: IncidentFormState = {
    dateTime: '',
    locationDescription: '',
    eventType: 'ACCIDENT',
    telemetryType: 'NONE',
    preciseTime: '',
    speedAtImpact: '',
    gForce: '',
    latitude: '',
    longitude: '',
    severity: '',
    notes: '',
    vehicleId: '',
    engineRpm: '',
    selectedParticipantIds: [],
};

function numberOrZero(value: string) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function detectTelemetryKind(telemetry: IncidentTelemetryDTO | null): IncidentFormState['telemetryType'] {
    if (!telemetry) {
        return 'NONE';
    }
    if ('type' in telemetry && telemetry.type === 'CRASH') {
        return 'CRASH';
    }
    if ('type' in telemetry && telemetry.type === 'VEHICLE') {
        return 'VEHICLE';
    }
    return 'NONE';
}

function toIncidentFormState(incident: IncidentDTO): IncidentFormState {
    const telemetryKind = detectTelemetryKind(incident.telemetry);
    const telemetry = incident.telemetry;

    return {
        dateTime: incident.dateTime ? incident.dateTime.slice(0, 16) : '',
        locationDescription: incident.locationDescription,
        eventType: incident.eventType,
        telemetryType: telemetryKind,
        preciseTime: telemetry?.preciseTime ? telemetry.preciseTime.slice(0, 16) : '',
        speedAtImpact: telemetry ? String(telemetry.speedAtImpact) : '',
        gForce: telemetry ? String(telemetry.gForce) : '',
        latitude: telemetry ? String(telemetry.latitude) : '',
        longitude: telemetry ? String(telemetry.longitude) : '',
        severity: telemetryKind === 'CRASH' && telemetry && 'severity' in telemetry ? String(telemetry.severity) : '',
        notes: telemetryKind === 'CRASH' && telemetry && 'notes' in telemetry ? telemetry.notes : '',
        vehicleId: telemetryKind === 'VEHICLE' && telemetry && 'vehicleId' in telemetry ? telemetry.vehicleId : '',
        engineRpm: telemetryKind === 'VEHICLE' && telemetry && 'engineRpm' in telemetry ? String(telemetry.engineRpm) : '',
        selectedParticipantIds: incident.participants.map((participant) => participant.id).filter(Boolean),
    };
}

function buildTelemetry(form: IncidentFormState): IncidentTelemetryDTO | null {
    if (form.telemetryType === 'NONE') {
        return null;
    }

    if (form.telemetryType === 'CRASH') {
        const telemetry: CrashTelemetryDTO = {
            type: 'CRASH',
            speedAtImpact: numberOrZero(form.speedAtImpact),
            gForce: numberOrZero(form.gForce),
            latitude: numberOrZero(form.latitude),
            longitude: numberOrZero(form.longitude),
            preciseTime: form.preciseTime || form.dateTime,
            severity: numberOrZero(form.severity),
            notes: form.notes.trim(),
        };
        return telemetry;
    }

    const telemetry: VehicleTelemetryDTO = {
        type: 'VEHICLE',
        speedAtImpact: numberOrZero(form.speedAtImpact),
        gForce: numberOrZero(form.gForce),
        latitude: numberOrZero(form.latitude),
        longitude: numberOrZero(form.longitude),
        preciseTime: form.preciseTime || form.dateTime,
        vehicleId: form.vehicleId.trim(),
        engineRpm: numberOrZero(form.engineRpm),
    };
    return telemetry;
}

function buildIncidentPayload(form: IncidentFormState, participants: ParticipantDTO[]): IncidentPayload {
    return {
        dateTime: form.dateTime,
        locationDescription: form.locationDescription.trim(),
        eventType: form.eventType,
        participants: participants.filter((participant) => form.selectedParticipantIds.includes(participant.id)),
        telemetry: buildTelemetry(form),
    };
}

function describeTelemetry(telemetry: IncidentTelemetryDTO | null) {
    if (!telemetry) {
        return 'No telemetry';
    }
    if ('type' in telemetry && telemetry.type === 'CRASH') {
        return `Crash ${telemetry.speedAtImpact} km/h, severity ${telemetry.severity}`;
    }
    if ('type' in telemetry && telemetry.type === 'VEHICLE') {
        return `Vehicle ${telemetry.vehicleId || 'n/a'}, RPM ${telemetry.engineRpm}`;
    }
    return `${telemetry.speedAtImpact} km/h at ${telemetry.preciseTime}`;
}

export function IncidentsView() {
    const incidentsQuery = useIncidentsQuery();
    const participantsQuery = useParticipantsQuery();
    const createMutation = useCreateIncidentMutation();
    const updateMutation = useUpdateIncidentMutation();
    const deleteMutation = useDeleteIncidentMutation();

    const actions = useActionState<IncidentDTO, IncidentFormState, string>({
        emptyForm: emptyIncidentForm,
        getId: (incident) => incident.incidentId,
        toForm: toIncidentFormState,
    });

    const [lookupInput, setLookupInput] = [actions.lookupInput, actions.setLookupInput];
    const activeLookupId = actions.activeLookupId;
    const lookupQuery = useIncidentQuery(activeLookupId);

    const createForm = actions.createForm;
    const setCreateForm = actions.setCreateForm;
    const updateId = actions.updateId;
    const setUpdateId = actions.setUpdateId;
    const updateForm = actions.updateForm;
    const setUpdateForm = actions.setUpdateForm;
    const deleteId = actions.deleteId;
    const setDeleteId = actions.setDeleteId;
    const lastDeletedId = actions.lastDeletedId;

    const incidents = incidentsQuery.data ?? [];
    const participants = participantsQuery.data ?? [];

    const incidentColumns: ColumnDef<IncidentDTO>[] = [
        {
            header: 'Incident',
            accessor: (incident) => (
                <>
                    <strong>{incident.locationDescription || 'Unnamed incident'}</strong>
                    <div>{incident.incidentId}</div>
                    <div>{incident.dateTime ? new Date(incident.dateTime).toLocaleString() : '—'}</div>
                </>
            ),
        },
        {
            header: 'Type',
            accessor: (incident) => <span className="crud-tag">{incident.eventType}</span>,
        },
        {
            header: 'Participants',
            accessor: (incident) => (
                <div className="crud-tag-row">
                    {incident.participants.length > 0
                        ? incident.participants.map((participant, index) => (
                            <span className="crud-tag" key={`${incident.incidentId}-${participant.id || index}`}>
                                {participant.firstName} {participant.lastName}
                            </span>
                        ))
                        : <span className="crud-tag">No participants</span>}
                </div>
            ),
        },
        {
            header: 'Telemetry',
            accessor: (incident) => describeTelemetry(incident.telemetry),
        },
        {
            header: 'Actions',
            accessor: (incident) => (
                <button className="crud-button crud-button--ghost" type="button" onClick={() => selectIncident(incident)}>
                    Use in forms
                </button>
            ),
        },
    ];

    const handleCreateChange = actions.setCreateField;

    const handleUpdateChange = actions.setUpdateField;

    const toggleSelectedParticipant = (participantId: string, currentIds: string[], setter: (next: string[]) => void) => {
        if (currentIds.includes(participantId)) {
            setter(currentIds.filter((id) => id !== participantId));
            return;
        }
        setter([...currentIds, participantId]);
    };

    const handleLookupSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        actions.activateLookup();
    };

    const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createMutation.mutate(buildIncidentPayload(createForm, participants), {
            onSuccess: actions.applyCreatedEntity,
        });
    };

    const handleUpdateSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = updateId.trim();
        if (!id) {
            return;
        }

        updateMutation.mutate({ id, payload: buildIncidentPayload(updateForm, participants) }, {
            onSuccess: actions.applyUpdatedEntity,
        });
    };

    const handleDeleteSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = deleteId.trim();
        if (!id) {
            return;
        }

        deleteMutation.mutate(id, {
            onSuccess: () => actions.applyDeletedId(id),
        });
    };

    const selectIncident = actions.selectEntity;

    const [visiblePanels, setVisiblePanels] = useState({
        list: true,
        lookup: true,
        create: true,
        update: true,
        delete: true,
    });

    return (
        <div className="crud-page">
            <Hero>
                <Hero.Kicker>Java Server / Incidents</Hero.Kicker>
                <Hero.Title>Incidents CRUD Console</Hero.Title>
                <Hero.Description>
                    Query-backed read models, mutation cards for create/update/delete, and a single place to inspect
                    the incident payload sent to the Java server endpoints.
                </Hero.Description>
            </Hero>

            <IncidentMetrics>
                <IncidentMetrics.Item>
                    <IncidentMetrics.Value>{incidents.length}</IncidentMetrics.Value>
                    <IncidentMetrics.Label>Cached incidents</IncidentMetrics.Label>
                </IncidentMetrics.Item>
                <IncidentMetrics.Item>
                    <IncidentMetrics.Value>{participants.length}</IncidentMetrics.Value>
                    <IncidentMetrics.Label>Participants available for incident payloads</IncidentMetrics.Label>
                </IncidentMetrics.Item>
                <IncidentMetrics.Item>
                    <IncidentMetrics.Value>5</IncidentMetrics.Value>
                    <IncidentMetrics.Label>Endpoints surfaced</IncidentMetrics.Label>
                </IncidentMetrics.Item>
            </IncidentMetrics>

            <ApiPanelMenu>
                <ApiPanelMenu.Item checked={visiblePanels.list} onChange={(checked) => setVisiblePanels(p => ({ ...p, list: checked }))}>GET /api/incidents</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.lookup} onChange={(checked) => setVisiblePanels(p => ({ ...p, lookup: checked }))}>GET /api/incidents/&#123;id&#125;</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.create} onChange={(checked) => setVisiblePanels(p => ({ ...p, create: checked }))}>POST /api/incidents</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.update} onChange={(checked) => setVisiblePanels(p => ({ ...p, update: checked }))}>PUT /api/incidents/&#123;id&#125;</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.delete} onChange={(checked) => setVisiblePanels(p => ({ ...p, delete: checked }))}>DELETE /api/incidents/&#123;id&#125;</ApiPanelMenu.Item>
            </ApiPanelMenu>

            <div className="crud-grid">
                {visiblePanels.list ? (
                    <ApiPanel
                        wide
                        title="GET /api/incidents"
                        description="Query cache of all incidents, with shortcuts into the endpoint cards below."
                        badge="Query"
                    >

                        {incidentsQuery.isLoading ? <div className="crud-empty">Loading incidents…</div> : null}
                        {incidentsQuery.isError ? <div className="crud-feedback crud-feedback--error">{incidentsQuery.error.message}</div> : null}
                        {!incidentsQuery.isLoading && !incidentsQuery.isError && incidents.length === 0 ? (
                            <div className="crud-empty">No incidents yet. Create one below to exercise the REST flow.</div>
                        ) : null}

                        {incidents.length > 0 ? (
                            <GenericTable
                                num={5}
                                columns={incidentColumns}
                                data={incidents}
                                keyExtractor={(incident) => incident.incidentId}
                            />
                        ) : null}
                    </ApiPanel>
                ) : null}

                {visiblePanels.lookup ? (
                    <ApiPanel
                        title="GET /api/incidents/{id}"
                        description="Lookup a single incident by server id."
                        badge="Query"
                    >

                        <IncidentInlineForm onSubmit={handleLookupSubmit}>
                            <IncidentInlineForm.Field>
                                <label htmlFor="incident-lookup-id">Incident ID</label>
                                <input id="incident-lookup-id" value={lookupInput} onChange={(event) => setLookupInput(event.target.value)} placeholder="Paste an incident id" />
                            </IncidentInlineForm.Field>
                            <button className="crud-button" type="submit">Fetch incident</button>
                        </IncidentInlineForm>

                        {lookupQuery.isFetching ? <div className="crud-feedback">Fetching incident…</div> : null}
                        {lookupQuery.isError ? <div className="crud-feedback crud-feedback--error">{lookupQuery.error.message}</div> : null}
                        {lookupQuery.data ? (
                            <IncidentFormGroup>
                                <IncidentFormGroup.Label>Incident snapshot</IncidentFormGroup.Label>
                                <p><strong>{lookupQuery.data.locationDescription || 'Unnamed incident'}</strong></p>
                                <p>ID: {lookupQuery.data.incidentId}</p>
                                <p>Type: {lookupQuery.data.eventType}</p>
                                <p>Date: {lookupQuery.data.dateTime ? new Date(lookupQuery.data.dateTime).toLocaleString() : '—'}</p>
                                <p>Telemetry: {describeTelemetry(lookupQuery.data.telemetry)}</p>
                            </IncidentFormGroup>
                        ) : null}
                    </ApiPanel>
                ) : null}

                {visiblePanels.create ? (
                    <ApiPanel
                        title="POST /api/incidents"
                        description="Create incidents with optional telemetry and participant snapshots."
                        badge="Mutation"
                    >

                        <IncidentForm
                            form={createForm}
                            participants={participants}
                            onFieldChange={handleCreateChange}
                            onToggleParticipant={(participantId) => toggleSelectedParticipant(
                                participantId,
                                createForm.selectedParticipantIds,
                                (next) => setCreateForm((current) => ({ ...current, selectedParticipantIds: next })),
                            )}
                            onSubmit={handleCreateSubmit}
                            submitLabel="Create incident"
                            pending={createMutation.isPending}
                        />

                        {createMutation.isError ? <div className="crud-feedback crud-feedback--error">{createMutation.error.message}</div> : null}
                        {createMutation.data ? <div className="crud-feedback">Created incident {createMutation.data.incidentId}</div> : null}
                    </ApiPanel>
                ) : null}

                {visiblePanels.update ? (
                    <ApiPanel
                        title="PUT /api/incidents/{id}"
                        description="Update an incident in place and refresh the Query cache on success."
                        badge="Mutation"
                    >

                        <IncidentInlineForm.Field>
                            <label htmlFor="incident-update-id">Incident ID</label>
                            <input id="incident-update-id" value={updateId} onChange={(event) => setUpdateId(event.target.value)} placeholder="Select from table or paste an id" required />
                        </IncidentInlineForm.Field>

                        <IncidentForm
                            form={updateForm}
                            participants={participants}
                            onFieldChange={handleUpdateChange}
                            onToggleParticipant={(participantId) => toggleSelectedParticipant(
                                participantId,
                                updateForm.selectedParticipantIds,
                                (next) => setUpdateForm((current) => ({ ...current, selectedParticipantIds: next })),
                            )}
                            onSubmit={handleUpdateSubmit}
                            submitLabel="Update incident"
                            pending={updateMutation.isPending}
                        />

                        {updateMutation.isError ? <div className="crud-feedback crud-feedback--error">{updateMutation.error.message}</div> : null}
                        {updateMutation.data ? <div className="crud-feedback">Updated incident {updateMutation.data.incidentId}</div> : null}
                    </ApiPanel>
                ) : null}

                {visiblePanels.delete ? (
                    <ApiPanel
                        title="DELETE /api/incidents/{id}"
                        description="Delete by incident id and clear cache for both list and detail query keys."
                        badge="Mutation"
                    >

                        <IncidentInlineForm onSubmit={handleDeleteSubmit}>
                            <IncidentInlineForm.Field>
                                <label htmlFor="incident-delete-id">Incident ID</label>
                                <input id="incident-delete-id" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} placeholder="ID to delete" required />
                            </IncidentInlineForm.Field>
                            <button className="crud-button crud-button--danger" type="submit" disabled={deleteMutation.isPending}>Delete incident</button>
                        </IncidentInlineForm>

                        {deleteMutation.isError ? <div className="crud-feedback crud-feedback--error">{deleteMutation.error.message}</div> : null}
                        {lastDeletedId ? <div className="crud-feedback">Deleted incident {lastDeletedId}</div> : null}
                    </ApiPanel>
                ) : null}
            </div>
        </div>
    );
}
