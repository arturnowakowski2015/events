import type { FormEvent } from 'react';
import type { ParticipantDTO } from '../../api/types';
import {
    useCreateParticipantMutation,
    useDeleteParticipantMutation,
    useParticipantQuery,
    useParticipantsQuery,
    useUpdateParticipantMutation,
} from '../hooks/useParticipants';
import { useActionState } from '../hooks/useActionState';
import { ApiPanel } from './ApiPanel';
import { ParticipantForm } from './ParticipantForm';
import { GenericTable, type ColumnDef } from '../../components/GenericTable';
import { ParticipantFormGroup } from '../componentsui/participant/ParticipantFormCompound';
import { ParticipantInlineForm, ParticipantMetrics } from '../componentsui/participant/ParticipantsViewCompound';
import { Hero } from '../componentsui/Hero';
import { ApiPanelMenu } from '../componentsui/ApiPanelMenu';
import { useState } from 'react';
import {
    buildParticipantPayload,
    emptyParticipantForm,
    formatRoles,
    formatVehicle,
    toParticipantFormState,
    type ParticipantFormState,
} from './participantFormTypes';
import './CrudWorkspace.css';

export function ParticipantsView() {
    const participantsQuery = useParticipantsQuery();
    const createMutation = useCreateParticipantMutation();
    const updateMutation = useUpdateParticipantMutation();
    const deleteMutation = useDeleteParticipantMutation();

    const actions = useActionState<ParticipantDTO, ParticipantFormState, string>({
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

    const participantColumns: ColumnDef<ParticipantDTO>[] = [
        {
            header: 'Name',
            accessor: (participant) => (
                <>
                    <strong>{participant.firstName} {participant.lastName}</strong>
                    <div>{participant.id}</div>
                </>
            ),
        },
        {
            header: 'Personal ID',
            accessor: (participant) => participant.personalId || '—',
        },
        {
            header: 'Vehicle',
            accessor: (participant) => formatVehicle(participant),
        },
        {
            header: 'Roles',
            accessor: (participant) => (
                <div className="crud-tag-row">
                    {formatRoles(participant).map((role) => (
                        <span className="crud-tag" key={`${participant.id}-${role}`}>{role}</span>
                    ))}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessor: (participant) => (
                <div className="crud-actions">
                    <button className="crud-button crud-button--ghost" type="button" onClick={() => selectParticipant(participant)}>
                        Use in forms
                    </button>
                </div>
            ),
        },
    ];

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
                <Hero.Kicker>Java Server / Participants</Hero.Kicker>
                <Hero.Title>Participants CRUD Console</Hero.Title>
                <Hero.Description>
                    Frontend components for every participant endpoint. React Query owns the server state,
                    mutations refresh the cache, and each card maps directly to a single REST operation.
                </Hero.Description>
            </Hero>

            <ParticipantMetrics>
                <ParticipantMetrics.Item>
                    <ParticipantMetrics.Value>{participants.length}</ParticipantMetrics.Value>
                    <ParticipantMetrics.Label>Cached participants</ParticipantMetrics.Label>
                </ParticipantMetrics.Item>
                <ParticipantMetrics.Item>
                    <ParticipantMetrics.Value>5</ParticipantMetrics.Value>
                    <ParticipantMetrics.Label>Endpoints surfaced</ParticipantMetrics.Label>
                </ParticipantMetrics.Item>
                <ParticipantMetrics.Item>
                    <ParticipantMetrics.Value>{createMutation.isPending || updateMutation.isPending || deleteMutation.isPending ? 'Busy' : 'Ready'}</ParticipantMetrics.Value>
                    <ParticipantMetrics.Label>Mutation status</ParticipantMetrics.Label>
                </ParticipantMetrics.Item>
            </ParticipantMetrics>

            <ApiPanelMenu>
                <ApiPanelMenu.Item checked={visiblePanels.list} onChange={(checked) => setVisiblePanels(p => ({ ...p, list: checked }))}>GET /api/participants</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.lookup} onChange={(checked) => setVisiblePanels(p => ({ ...p, lookup: checked }))}>GET /api/participants/&#123;id&#125;</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.create} onChange={(checked) => setVisiblePanels(p => ({ ...p, create: checked }))}>POST /api/participants</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.update} onChange={(checked) => setVisiblePanels(p => ({ ...p, update: checked }))}>PUT /api/participants/&#123;id&#125;</ApiPanelMenu.Item>
                <ApiPanelMenu.Item checked={visiblePanels.delete} onChange={(checked) => setVisiblePanels(p => ({ ...p, delete: checked }))}>DELETE /api/participants/&#123;id&#125;</ApiPanelMenu.Item>
            </ApiPanelMenu>

            <div className="crud-grid">
                {visiblePanels.list ? (
                    <ApiPanel
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
                            <GenericTable
                                num={5}
                                columns={participantColumns}
                                data={participants}
                                keyExtractor={(participant) => participant.id}
                            />
                        ) : null}
                    </ApiPanel>
                ) : null}

                {visiblePanels.lookup ? (
                    <ApiPanel
                        title="GET /api/participants/{id}"
                        description="Lookup a single participant by identifier."
                        badge="Query"
                    >

                        <ParticipantInlineForm onSubmit={handleLookupSubmit}>
                            <ParticipantInlineForm.Field>
                                <label htmlFor="participant-lookup-id">Participant ID</label>
                                <input id="participant-lookup-id" value={lookupInput} onChange={(event) => setLookupInput(event.target.value)} placeholder="Paste a participant id" />
                            </ParticipantInlineForm.Field>
                            <button className="crud-button" type="submit">Fetch participant</button>
                        </ParticipantInlineForm>

                        {lookupQuery.isFetching ? <div className="crud-feedback">Fetching participant…</div> : null}
                        {lookupQuery.isError ? <div className="crud-feedback crud-feedback--error">{lookupQuery.error.message}</div> : null}
                        {lookupQuery.data ? (
                            <div className="crud-stack">
                                <ParticipantFormGroup>
                                    <ParticipantFormGroup.Label>Participant snapshot</ParticipantFormGroup.Label>
                                    <p><strong>{lookupQuery.data.firstName} {lookupQuery.data.lastName}</strong></p>
                                    <p>ID: {lookupQuery.data.id}</p>
                                    <p>Personal ID: {lookupQuery.data.personalId || '—'}</p>
                                    <p>Vehicle: {formatVehicle(lookupQuery.data)}</p>
                                    <div className="crud-tag-row">
                                        {formatRoles(lookupQuery.data).map((role) => (
                                            <span className="crud-tag" key={`lookup-${role}`}>{role}</span>
                                        ))}
                                    </div>
                                </ParticipantFormGroup>
                            </div>
                        ) : null}
                    </ApiPanel>
                ) : null}

                {visiblePanels.create ? (
                    <ApiPanel
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
                    </ApiPanel>
                ) : null}

                {visiblePanels.update ? (
                    <ApiPanel
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
                    </ApiPanel>
                ) : null}

                {visiblePanels.delete ? (
                    <ApiPanel
                        title="DELETE /api/participants/{id}"
                        description="Delete by id and let Query invalidate collection + detail caches."
                        badge="Mutation"
                    >

                        <ParticipantInlineForm onSubmit={handleDeleteSubmit}>
                            <ParticipantInlineForm.Field>
                                <label htmlFor="participant-delete-id">Participant ID</label>
                                <input id="participant-delete-id" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} placeholder="ID to delete" required />
                            </ParticipantInlineForm.Field>
                            <button className="crud-button crud-button--danger" type="submit" disabled={deleteMutation.isPending}>Delete participant</button>
                        </ParticipantInlineForm>

                        {deleteMutation.isError ? <div className="crud-feedback crud-feedback--error">{deleteMutation.error.message}</div> : null}
                        {lastDeletedId ? <div className="crud-feedback">Deleted participant {lastDeletedId}</div> : null}
                    </ApiPanel>
                ) : null}
            </div>
        </div>
    );
}