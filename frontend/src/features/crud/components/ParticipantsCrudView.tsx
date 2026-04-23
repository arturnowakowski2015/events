import { useState, type FormEvent } from 'react';
import type { ParticipantDTO } from '../../../api/types';
import {
    useCreateParticipantMutation,
    useDeleteParticipantMutation,
    useParticipantQuery,
    useParticipantsQuery,
    useUpdateParticipantMutation,
} from '../hooks/useParticipantsCrud';
import { useCrudActionState } from '../hooks/useCrudActionState';
import { CrudPanel } from './CrudPanel';
import { ParticipantForm } from './ParticipantForm';
import {
    buildParticipantPayload,
    emptyParticipantForm,
    formatRoles,
    formatVehicle,
    toParticipantFormState,
    type ParticipantFormState,
} from './participantFormTypes';
import './CrudWorkspace.css';

export function ParticipantsCrudView() {
    const participantsQuery = useParticipantsQuery();
    const createMutation = useCreateParticipantMutation();
    const updateMutation = useUpdateParticipantMutation();
    const deleteMutation = useDeleteParticipantMutation();

    const actions = useCrudActionState<ParticipantDTO, ParticipantFormState, string>({
        emptyForm: emptyParticipantForm,
        getId: (participant) => participant.id,
        toForm: toParticipantFormState,
    });

    const [lookupInput, setLookupInput] = [actions.lookupInput, actions.setLookupInput];
    const activeLookupId = actions.activeLookupId;
    const lookupQuery = useParticipantQuery(activeLookupId);

    const createForm = actions.createForm;
    const updateId = actions.updateId;
    const setUpdateId = actions.setUpdateId;
    const updateForm = actions.updateForm;
    const deleteId = actions.deleteId;
    const setDeleteId = actions.setDeleteId;
    const lastDeletedId = actions.lastDeletedId;

    const participants = participantsQuery.data ?? [];

    const handleCreateChange = actions.setCreateField;

    const handleUpdateChange = actions.setUpdateField;

    const handleLookupSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        actions.activateLookup();
    };

    const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createMutation.mutate(buildParticipantPayload(createForm), {
            onSuccess: actions.applyCreatedEntity,
        });
    };

    const handleUpdateSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = updateId.trim();
        if (!id) {
            return;
        }

        updateMutation.mutate({ id, payload: buildParticipantPayload(updateForm) }, {
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

    const selectParticipant = actions.selectEntity;

    return (
        <div className="crud-page">
            <section className="crud-hero">
                <div className="crud-kicker">Java Server / Participants</div>
                <h2>Participants CRUD Console</h2>
                <p>
                    Frontend components for every participant endpoint. React Query owns the server state,
                    mutations refresh the cache, and each card maps directly to a single REST operation.
                </p>
            </section>

            <section className="crud-metrics">
                <div className="crud-metric">
                    <strong>{participants.length}</strong>
                    <span>Cached participants</span>
                </div>
                <div className="crud-metric">
                    <strong>5</strong>
                    <span>Endpoints surfaced</span>
                </div>
                <div className="crud-metric">
                    <strong>{createMutation.isPending || updateMutation.isPending || deleteMutation.isPending ? 'Busy' : 'Ready'}</strong>
                    <span>Mutation status</span>
                </div>
            </section>

            <div className="crud-grid">
                <CrudPanel
                    wide
                    title="GET /api/participants"
                    description="Server-backed list with shortcuts that prefill the other endpoint components."
                    badge="Query"
                >

                    {participantsQuery.isLoading ? <div className="crud-empty">Loading participants…</div> : null}
                    {participantsQuery.isError ? (
                        <div className="crud-feedback crud-feedback--error">{participantsQuery.error.message}</div>
                    ) : null}

                    {!participantsQuery.isLoading && !participantsQuery.isError && participants.length === 0 ? (
                        <div className="crud-empty">No participants yet. Use the create endpoint below to seed data.</div>
                    ) : null}

                    {participants.length > 0 ? (
                        <table className="crud-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Personal ID</th>
                                    <th>Vehicle</th>
                                    <th>Roles</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map((participant) => (
                                    <tr key={participant.id}>
                                        <td>
                                            <strong>{participant.firstName} {participant.lastName}</strong>
                                            <div>{participant.id}</div>
                                        </td>
                                        <td>{participant.personalId || '—'}</td>
                                        <td>{formatVehicle(participant)}</td>
                                        <td>
                                            <div className="crud-tag-row">
                                                {formatRoles(participant).map((role) => (
                                                    <span className="crud-tag" key={`${participant.id}-${role}`}>{role}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="crud-actions">
                                                <button className="crud-button crud-button--ghost" type="button" onClick={() => selectParticipant(participant)}>
                                                    Use in forms
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null}
                </CrudPanel>

                <CrudPanel
                    title="GET /api/participants/{id}"
                    description="Lookup a single participant by identifier."
                    badge="Query"
                >

                    <form className="crud-inline-form" onSubmit={handleLookupSubmit}>
                        <div className="crud-field">
                            <label htmlFor="participant-lookup-id">Participant ID</label>
                            <input id="participant-lookup-id" value={lookupInput} onChange={(event) => setLookupInput(event.target.value)} placeholder="Paste a participant id" />
                        </div>
                        <button className="crud-button" type="submit">Fetch participant</button>
                    </form>

                    {lookupQuery.isFetching ? <div className="crud-feedback">Fetching participant…</div> : null}
                    {lookupQuery.isError ? <div className="crud-feedback crud-feedback--error">{lookupQuery.error.message}</div> : null}
                    {lookupQuery.data ? (
                        <div className="crud-stack">
                            <div className="crud-group">
                                <div className="crud-group__label">Participant snapshot</div>
                                <p><strong>{lookupQuery.data.firstName} {lookupQuery.data.lastName}</strong></p>
                                <p>ID: {lookupQuery.data.id}</p>
                                <p>Personal ID: {lookupQuery.data.personalId || '—'}</p>
                                <p>Vehicle: {formatVehicle(lookupQuery.data)}</p>
                                <div className="crud-tag-row">
                                    {formatRoles(lookupQuery.data).map((role) => (
                                        <span className="crud-tag" key={`lookup-${role}`}>{role}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </CrudPanel>

                <CrudPanel
                    title="POST /api/participants"
                    description="Create a participant and hydrate the cache after success."
                    badge="Mutation"
                >
                    <ParticipantForm
                        mode="create"
                        form={createForm}
                        onFieldChange={handleCreateChange}
                        onSubmit={handleCreateSubmit}
                        submitLabel="Create participant"
                        pending={createMutation.isPending}
                        onReset={() => actions.setCreateForm(emptyParticipantForm)}
                    />

                    {createMutation.isError ? <div className="crud-feedback crud-feedback--error">{createMutation.error.message}</div> : null}
                    {createMutation.data ? <div className="crud-feedback">Created participant {createMutation.data.id}</div> : null}
                </CrudPanel>

                <CrudPanel
                    title="PUT /api/participants/{id}"
                    description="Update an existing participant. Use the list above to prefill the form."
                    badge="Mutation"
                >
                    <ParticipantForm
                        mode="update"
                        form={updateForm}
                        participantId={updateId}
                        onParticipantIdChange={setUpdateId}
                        onFieldChange={handleUpdateChange}
                        onSubmit={handleUpdateSubmit}
                        submitLabel="Update participant"
                        pending={updateMutation.isPending}
                    />

                    {updateMutation.isError ? <div className="crud-feedback crud-feedback--error">{updateMutation.error.message}</div> : null}
                    {updateMutation.data ? <div className="crud-feedback">Updated participant {updateMutation.data.id}</div> : null}
                </CrudPanel>

                <CrudPanel
                    title="DELETE /api/participants/{id}"
                    description="Delete by id and let Query invalidate collection + detail caches."
                    badge="Mutation"
                >

                    <form className="crud-inline-form" onSubmit={handleDeleteSubmit}>
                        <div className="crud-field">
                            <label htmlFor="participant-delete-id">Participant ID</label>
                            <input id="participant-delete-id" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} placeholder="ID to delete" required />
                        </div>
                        <button className="crud-button crud-button--danger" type="submit" disabled={deleteMutation.isPending}>Delete participant</button>
                    </form>

                    {deleteMutation.isError ? <div className="crud-feedback crud-feedback--error">{deleteMutation.error.message}</div> : null}
                    {lastDeletedId ? <div className="crud-feedback">Deleted participant {lastDeletedId}</div> : null}
                </CrudPanel>
            </div>
        </div>
    );
}