import React from 'react';
import './CompareParticipants.css';

// ---------------------------------------------------------------------------
// Typy domenowe
// ---------------------------------------------------------------------------
type Role = { eventId: string; role: string };

type Participant = {
    id: string;
    personalId?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    roles: Role[];
    events: string[];
};

// ---------------------------------------------------------------------------
// Pola do porownania (const tuple — pelna kontrola typow)
// ---------------------------------------------------------------------------
const fields = ['personalId', 'firstName', 'lastName', 'phone', 'email', 'address'] as const;
type Field = typeof fields[number];

// ---------------------------------------------------------------------------
// State — jeden obiekt zamiast 6 osobnych useState
// ---------------------------------------------------------------------------
type State = {
    participants: Participant[];
    targetId: string;
    selectedSourceIds: string[];
    choices: Record<Field, string | null>;
    selectedRoles: Record<string, boolean>;
    mergeResult: Record<string, unknown> | null;
};

// ---------------------------------------------------------------------------
// Actions — kazda interakcja uzytkownika to osobna akcja (union discriminated)
// ---------------------------------------------------------------------------
type Action =
    | { type: 'SET_PARTICIPANTS'; payload: Participant[] }
    | { type: 'SET_TARGET'; id: string }
    | { type: 'TOGGLE_SOURCE'; id: string }
    | { type: 'CHOOSE_FIELD'; field: Field; participantId: string }
    | { type: 'TOGGLE_ROLE'; key: string }
    | { type: 'SET_MERGED'; merged: Record<string, unknown> }
    | { type: 'HIDE_MERGED' }
    | { type: 'RESET' };

// ---------------------------------------------------------------------------
// Pure helpers — poza reducerem, latwe do testow jednostkowych
// ---------------------------------------------------------------------------

/** Buduje liste aktywnych uczestnikow: target jako pierwszy, potem zaznaczone zrodla */
function buildActiveList(participants: Participant[], targetId: string, selectedSourceIds: string[]): Participant[] {
    const list: Participant[] = [];
    const t = participants.find(p => p.id === targetId);
    if (t) list.push(t);
    participants.forEach(p => { if (p.id !== targetId && selectedSourceIds.includes(p.id)) list.push(p); });
    return list;
}

/** Dla kazdego pola wybiera uczestnika z niepusta wartoscia, preferujac target */
function computeInitialChoices(active: Participant[]): Record<Field, string | null> {
    const choice = {} as Record<Field, string | null>;
    fields.forEach(f => {
        const targetHasValue = active[0] && (active[0] as Record<string, unknown>)[f];
        if (targetHasValue) { choice[f] = active[0].id; return; }
        const found = active.slice(1).find(p => (p as Record<string, unknown>)[f]);
        choice[f] = found ? found.id : (active[0]?.id ?? null);
    });
    return choice;
}

/** Buduje mape (klucz = pid:eventId:role) -> true dla wszystkich rol */
function buildRolesMap(participants: Participant[]): Record<string, boolean> {
    const map: Record<string, boolean> = {};
    participants.forEach(p => p.roles.forEach(r => { map[`${p.id}:${r.eventId}:${r.role}`] = true; }));
    return map;
}

// ---------------------------------------------------------------------------
// Reducer — czysta funkcja (state, action) => newState, zero side-effectow
// ---------------------------------------------------------------------------
function reducer(state: State, action: Action): State {
    switch (action.type) {

        case 'SET_PARTICIPANTS': {
            // Po zaladowaniu z API: przelicz wybory i role na nowej liscie
            const participants = action.payload;
            const active = buildActiveList(participants, state.targetId, state.selectedSourceIds);
            return { ...state, participants, choices: computeInitialChoices(active), selectedRoles: buildRolesMap(participants) };
        }

        case 'SET_TARGET': {
            // Zmiana targetu automatycznie re-synchronizuje wybory
            const active = buildActiveList(state.participants, action.id, state.selectedSourceIds);
            return { ...state, targetId: action.id, choices: computeInitialChoices(active) };
        }

        case 'TOGGLE_SOURCE': {
            // Dodanie/usuniecie zrodla re-synchronizuje wybory — nie potrzeba osobnego useEffect
            const selectedSourceIds = state.selectedSourceIds.includes(action.id)
                ? state.selectedSourceIds.filter(x => x !== action.id)
                : [...state.selectedSourceIds, action.id];
            const active = buildActiveList(state.participants, state.targetId, selectedSourceIds);
            return { ...state, selectedSourceIds, choices: computeInitialChoices(active) };
        }
        case 'CHOOSE_FIELD':
            // Reczny wybor wartosci dla konkretnego pola przez uzytkownika
            return { ...state, choices: { ...state.choices, [action.field]: action.participantId } };

        case 'TOGGLE_ROLE':
            return { ...state, selectedRoles: { ...state.selectedRoles, [action.key]: !state.selectedRoles[action.key] } };

        case 'SET_MERGED':
            return { ...state, mergeResult: action.merged };

        case 'HIDE_MERGED':
            return { ...state, mergeResult: null };

        case 'RESET': {
            // Przywroc stan poczatkowy zachowujac zaladowanych uczestnikow
            const { participants } = state;
            const targetId = participants[0].id;
            const selectedSourceIds = participants.slice(1).map(p => p.id);
            const active = buildActiveList(participants, targetId, selectedSourceIds);
            return { participants, targetId, selectedSourceIds, choices: computeInitialChoices(active), selectedRoles: buildRolesMap(participants), mergeResult: null };
        }

        default:
            return state;
    }
}

/** Inicjalizator stanu — wywolywany tylko raz przez useReducer */
function buildInitialState(participants: Participant[]): State {
    const targetId = participants[0].id;
    const selectedSourceIds = participants.slice(1).map(p => p.id);
    const active = buildActiveList(participants, targetId, selectedSourceIds);
    return { participants, targetId, selectedSourceIds, choices: computeInitialChoices(active), selectedRoles: buildRolesMap(participants), mergeResult: null };
}

// ---------------------------------------------------------------------------
// Sample data (fallback gdy API niedostepne)
// ---------------------------------------------------------------------------
const sampleParticipants: Participant[] = [
    {
        id: 'p-100',
        personalId: 'ABC123456',
        firstName: 'Jan',
        lastName: 'Kowalski',
        phone: '+48 600 700 800',
        email: 'jan.k@example.com',
        address: 'ul. Główna 1, 00-001 Miasto',
        roles: [{ eventId: 'e-1', role: 'Victim' }, { eventId: 'e-2', role: 'Witness' }],
        events: ['e-1', 'e-2']
    },
    {
        id: 'p-999',
        personalId: 'ABC123456',
        firstName: 'Janusz',
        lastName: 'Kowalski',
        phone: null,
        email: 'j.kowalski@example.com',
        address: 'ul. Główna 1, 00-001 Miasto',
        roles: [{ eventId: 'e-3', role: 'Perpetrator' }],
        events: ['e-3']
    },
    {
        id: 'p-500',
        personalId: 'ABC123456',
        firstName: 'Jan',
        lastName: 'Kowalski',
        phone: '+48 600 700 801',
        email: null,
        address: null,
        roles: [{ eventId: 'e-4', role: 'Officer' }],
        events: ['e-4']
    }
];

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
async function apiFetchParticipants(personalId?: string): Promise<Participant[]> {
    try {
        const url = personalId ? `/api/participants?personalId=${encodeURIComponent(personalId)}` : '/api/participants';
        const r = await fetch(url);
        if (!r.ok) throw new Error('Network');
        const json = await r.json();
        return Array.isArray(json) ? (json as Participant[]) : sampleParticipants;
    } catch (e) {
        console.warn('Falling back to sample participants', e);
        return sampleParticipants;
    }
}

async function apiPostMerge(targetId: string, payload: unknown): Promise<Record<string, unknown> | null> {
    try {
        const r = await fetch(`/api/participants/${encodeURIComponent(targetId)}/merge`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error('Merge failed');
        return await r.json();
    } catch (e) {
        console.warn('Merge fallback (local compute) due to', e);
        return null;
    }
}

// ---------------------------------------------------------------------------
// Subkomponent wiersza tabeli porownan
// ---------------------------------------------------------------------------
interface FieldRowMultiProps {
    name: string;
    options: { id: string; label: string; value: unknown }[];
    choice?: string | null;
    onChoose: (id: string) => void;
}

function FieldRowMulti({ name, options, choice, onChoose }: FieldRowMultiProps) {
    const valuesMap = options.reduce<Record<string, string>>((acc, o) => { acc[o.id] = o.value === null ? '' : String(o.value); return acc; }, {});
    const differs = new Set(Object.values(valuesMap)).size > 1;
    return (
        <tr className={differs ? 'cp-diff' : ''}>
            <td className="field-key">{name}</td>
            <td colSpan={3}>
                <div className="cp-inline-group">
                    {options.map(o => (
                        <label key={o.id} className="cp-check-inline cp-check-inline-tight">
                            <input className="cp-check-input" type="radio" name={name} checked={choice === o.id} onChange={() => onChoose(o.id)} />
                            <span className="cp-label-gap participant-tag">{o.label}</span>
                            <span className="cp-label-gap">{String(o.value === null ? '' : o.value)}</span>
                        </label>
                    ))}
                </div>
            </td>
        </tr>
    );
}

// ---------------------------------------------------------------------------
// Komponent glowny
// ---------------------------------------------------------------------------
const CompareParticipants = () => {
    // useReducer zastepuje 6 osobnych useState + useEffect do synchronizacji choices.
    // buildInitialState wywolywany jest raz (trzeci arg useReducer = inicjalizator).
    const [state, dispatch] = React.useReducer(reducer, sampleParticipants, buildInitialState);
    const { participants, targetId, selectedSourceIds, choices, selectedRoles, mergeResult } = state;

    // Jedyny efekt uboczny: zaladowanie danych z API przy montowaniu komponentu
    React.useEffect(() => {
        (async () => {
            const list = await apiFetchParticipants();
            if (Array.isArray(list) && list.length > 0 && typeof list[0] === 'object') {
                const payload: Participant[] = list.map(p => ({
                    id: p.id,
                    firstName: p.firstName ?? '',
                    lastName: p.lastName ?? '',
                    personalId: p.personalId ?? '',
                    phone: p.phone ?? null,
                    email: p.email ?? null,
                    address: p.address ?? null,
                    roles: (p.roles || []).map(r => ({ eventId: r.eventId || 'unknown', role: r.role || 'role' })),
                    events: (p.events || [])
                }));
                dispatch({ type: 'SET_PARTICIPANTS', payload });
            }
        })();
    }, []); // pusta tablica — efekt odpala sie tylko raz (montowanie)

    // Buduje payload dla endpointu merge na podstawie aktualnych wyborow
    function computeMergedPayload() {
        const merged: Record<string, unknown> = {
            id: targetId,
            mergedFrom: selectedSourceIds.slice(),
            sources: selectedSourceIds.slice()
        };
        const getParticipant = (id?: string | null) => participants.find(p => p.id === id);
        fields.forEach(f => {
            const p = getParticipant(choices[f]);
            merged[f] = p ? (p as Record<string, unknown>)[f] : null;
        });
        // Zbierz unikalne role ze wszystkich zaznaczonych uczestnikow
        const mergedRoles: { eventId: string; role: string; fromParticipant: string }[] = [];
        Object.keys(selectedRoles).forEach(key => {
            if (selectedRoles[key]) {
                const [pid, eventId, role] = key.split(':');
                mergedRoles.push({ eventId, role, fromParticipant: pid });
            }
        });
        const uniq: typeof mergedRoles = [];
        mergedRoles.forEach(r => { if (!uniq.find(u => u.eventId === r.eventId && u.role === r.role)) uniq.push(r); });
        merged.roles = uniq;
        merged.events = Array.from(new Set(uniq.map(r => r.eventId)));
        return merged;
    }

    function doMerge() {
        const mergedLocal = computeMergedPayload();
        (async () => {
            const fieldResolution = Object.fromEntries(fields.map(f => [f, choices[f]]));
            const payload = { sourceIds: selectedSourceIds, fieldResolution };
            const remote = await apiPostMerge(targetId, payload);
            // dispatch zamiast setLastMerged — aktualizacja przez reducer
            dispatch({ type: 'SET_MERGED', merged: remote ?? mergedLocal });
        })();
    }

    // Pochodna — obliczana na biezaco, nie trzymana w stanie
    const activeParticipants = buildActiveList(participants, targetId, selectedSourceIds);
    const optionsByField = fields.reduce<Record<string, { id: string; label: string; value: unknown }[]>>((acc, f) => {
        acc[f] = activeParticipants.map(p => ({ id: p.id, label: `${p.id}${p.id === targetId ? ' (target)' : ''}`, value: (p as Record<string, unknown>)[f] }));
        return acc;
    }, {});

    return (
        <div className="cp-container">
            <h3>Porównanie uczestników — podgląd MERGE (wielu źródeł)</h3>
            <p className="cp-text-muted">Interaktywny demo widok: wybierz target (rekord docelowy), wybierz które źródła chcesz scalić, dla każdego pola wskaż, którą wartość zachować, a następnie kliknij <strong>Merge</strong>.</p>

            <div className="cp-layout">
                <div className="cp-main">
                    <div className="cp-card cp-mb-2"><div className="cp-card-body">
                        <h6>Wybór rekordów</h6>
                        <div className="cp-mb-2">
                            <div className="cp-small cp-text-muted">Wybierz target (rekord docelowy):</div>
                            {participants.map(p => (
                                <label className="cp-check-inline cp-me-3" key={p.id}>
                                    {/* SET_TARGET re-synchronizuje wybory automatycznie w reducerze */}
                                    <input className="cp-check-input" type="radio" name="target" checked={targetId === p.id} onChange={() => dispatch({ type: 'SET_TARGET', id: p.id })} />
                                    <span className="cp-label-gap">{p.id} — {p.firstName} {p.lastName}</span>
                                </label>
                            ))}
                        </div>
                        <div>
                            <div className="cp-small cp-text-muted">Wybierz źródła do scalenia (można wybrać wiele):</div>
                            {participants.filter(p => p.id !== targetId).map(p => (
                                <label className="cp-check-inline cp-me-3" key={p.id}>
                                    {/* TOGGLE_SOURCE re-synchronizuje wybory automatycznie w reducerze */}
                                    <input className="cp-check-input" type="checkbox" checked={selectedSourceIds.includes(p.id)} onChange={() => dispatch({ type: 'TOGGLE_SOURCE', id: p.id })} />
                                    <span className="cp-label-gap">{p.id} — {p.firstName} {p.lastName}</span>
                                </label>
                            ))}
                        </div>
                    </div></div>

                    <table className="cp-table">
                        <thead className="cp-table-head"><tr><th>Pole</th><th colSpan={3}></th></tr></thead>
                        <tbody>
                            {fields.map(f => (
                                <FieldRowMulti
                                    key={f}
                                    name={f}
                                    options={optionsByField[f]}
                                    choice={choices[f]}
                                    onChoose={(pid) => dispatch({ type: 'CHOOSE_FIELD', field: f, participantId: pid })}
                                />
                            ))}
                        </tbody>
                    </table>

                    <div className="cp-mb-3">
                        <h6>Role (wybierz które przenieść)</h6>
                        <div className="cp-inline-group cp-gap-3">
                            {participants.flatMap(p => p.roles.map(r => ({ key: `${p.id}:${r.eventId}:${r.role}`, label: `${r.role} (event ${r.eventId}) — from ${p.id}` }))).map((item, i) => (
                                <label className="cp-check-inline" key={`${item.key}:${i}`}>
                                    <input className="cp-check-input" type="checkbox" checked={!!selectedRoles[item.key]} onChange={() => dispatch({ type: 'TOGGLE_ROLE', key: item.key })} />
                                    <span className="cp-label-gap">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="cp-mb-3">
                        <button className="cp-btn cp-btn-primary cp-me-2" onClick={doMerge}>Merge</button>
                        {/* RESET przywraca stan poczatkowy bez ponownego ladowania z API */}
                        <button className="cp-btn cp-btn-secondary" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
                    </div>

                    {mergeResult && (
                        <div>
                            <h6>Wynik scalenia</h6>
                            <pre>{JSON.stringify(mergeResult, null, 2)}</pre>
                            <button className="cp-btn cp-btn-outline-primary cp-btn-sm cp-me-2" onClick={() => {
                                const blob = new Blob([JSON.stringify(mergeResult, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url; a.download = 'merged-participant.json'; a.click();
                                URL.revokeObjectURL(url);
                            }}>Pobierz JSON</button>
                            {/* HIDE_MERGED ukrywa panel bez zerowania reszty stanu */}
                            <button className="cp-btn cp-btn-outline-danger cp-btn-sm" onClick={() => dispatch({ type: 'HIDE_MERGED' })}>Ukryj</button>
                        </div>
                    )}

                </div>

                <div className="cp-side">
                    <div className="cp-card cp-mb-3"><div className="cp-card-body">
                        <h6>Informacje</h6>
                        <p className="cp-small cp-text-muted">Target ID: <strong>{targetId}</strong></p>
                        <p className="cp-small"><strong>Wybrane źródła:</strong><br />{selectedSourceIds.join(', ') || '(brak)'}</p>
                        <p className="cp-small cp-text-muted">Aktywna lista (target + źródła):</p>
                        <div>
                            {activeParticipants.map(a => (<div key={a.id} className="participant-tag">{a.id} — {a.firstName} {a.lastName}</div>))}
                        </div>
                    </div></div>

                    <div className="cp-card"><div className="cp-card-body">
                        <h6>Instrukcja</h6>
                        <ul>
                            <li>Wybierz rekord docelowy (target).</li>
                            <li>Zaznacz wszystkie rekordy-źródła, które chcesz scalić z targetem.</li>
                            <li>Dla każdego pola wybierz, z którego rekordu ma pochodzić wartość.</li>
                            <li>Wybierz role do przeniesienia.</li>
                            <li>Kliknij <strong>Merge</strong> aby wygenerować wynik (demo nie modyfikuje backendu).</li>
                        </ul>
                    </div></div>

                </div>
            </div>
        </div>
    );
};

export default CompareParticipants;