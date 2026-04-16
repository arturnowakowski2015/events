import React from 'react';
import './CompareParticipants.css';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { Option } from "../components/select/Option";
import { Select } from '../components/select/Select';
import { type MergeRequest, mergeParticipant } from '../api/participants';

// This file is a TypeScript/TSX conversion of the inline React demo
// It mirrors the behavior of the original index.html demo and is
// intended to be placed at src/main/resources/static/merge/index.tsx

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

async function apiPostMerge(targetId: string, payload: any): Promise<any | null> {
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

// const fields = ['personalId', 'firstName', 'lastName', 'phone', 'email', 'address'];
const fields = ['personalId', 'firstName', 'lastName', 'phone', 'email', 'address'] as const;
type MergeField = typeof fields[number];
type MergeChoiceMap = Record<MergeField, string | null>;



function FieldRowMulti({ name, options, choice, onChoose }: {
    name: string;
    options:
    {
        id: string, label: string,
        value: any
    }[];
    choice?: string | null;
    onChoose: (id: string) => void
}) {
    const valuesMap = options.reduce<Record<string, any>>((acc, o) => {
        acc[o.id] = o.value === null ? '' : o.value; return acc;
    }, {});
    const differs = new Set(Object.values(valuesMap)).size > 1;
    return (


        <tr className={differs ? 'cp-diff' : ''}>
            <td className="field-key">???{name}</td>
            <td colSpan={3}>
                <div className="cp-inline-group">
                    {options.map(o => (
                        <label key={o.id} className="cp-check-inline cp-check-inline-tight">///
                            <input className="cp-check-input" type="radio" name={name} checked={choice === o.id}
                                onChange={() => onChoose(o.id)} />
                            <span className="cp-label-gap participant-tag">{o.label}</span>
                            <span className="cp-label-gap">\\{String(o.value === null ? '' : o.value)}</span>
                        </label>
                    ))}
                </div>
            </td>
        </tr>
    );
}

const CompareParticipants = () => {
    const [participants, setParticipants] = React.useState<Participant[]>(sampleParticipants);
    const [targetId, setTargetId] = React.useState<string>(participants[0].id);
    const [selectedSourceIds, setSelectedSourceIds] = React.useState<string[]>(() => participants.slice(1).map(p => p.id));

    React.useEffect(() => {
        (async () => {
            const list = await apiFetchParticipants();
            if (Array.isArray(list) && list.length > 0 && typeof list[0] === 'object') {
                setParticipants(list.map(p => ({
                    id: p.id,
                    firstName: p.firstName ?? '',
                    lastName: p.lastName ?? '',
                    personalId: p.personalId ?? '',
                    phone: p.phone ?? null,
                    email: p.email ?? null,
                    address: p.address ?? null,
                    roles: (p.roles || []).map((r: any) => ({
                        eventId: r.eventId || (typeof r.description === 'string' ? (r.description.match(/\(([^)]+)\)/)?.[1] || 'unknown') : 'unknown'),
                        role: r.role || r.roleName || 'role'
                    })),
                    events: (p.events || [])
                })));
            };
        })();

    }, []);

    function toggleSource(id: string) {
        setSelectedSourceIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }

    function getParticipant(id?: string | null) {
        return participants.find(p => p.id === id);
    }

    function activeList() {
        const list: Participant[] = [];
        const t = getParticipant(targetId);
        if (t) list.push(t);
        participants.forEach(p => {
            if (p.id !== targetId && selectedSourceIds.includes(p.id))
                list.push(p);
        });
        return list;
    }

    // 1. Definiujemy typy pól, po których będziemy iterować
    // function computeInitialChoices(active: Participant[], fields: (keyof Participant)[]) {
    //     const choice = fields.reduce<Record<string, string | null>>((acc, f) => {
    //         const firstParticipant = active[0];

    //         // Brak uczestników - ustawiamy null
    //         if (!firstParticipant) {
    //             acc[f as string] = null;
    //             return acc;
    //         }

    //         // TypeScript już wie, że f jest kluczem Participant, więc dopuszcza zapis firstParticipant[f]
    //         const hasFieldInFirst = firstParticipant[f];

    //         if (hasFieldInFirst) {
    //             acc[f as string] = firstParticipant.id;
    //             return acc;
    //         }

    //         // Szukanie w pozostałych uczestnikach
    //         const found = active.slice(1).find(p => p[f]);

    //         acc[f as string] = found ? found.id : firstParticipant.id;
    //         return acc;
    //     }, {});

    //     return choice;
    // }

    function computeInitialChoices(active: Participant[]): MergeChoiceMap {
        const choice = {} as MergeChoiceMap;
        const firstParticipant = active[0];

        fields.forEach((f) => {
            if (!firstParticipant) {
                choice[f] = null;
                return;
            }

            const hasFieldInFirst = firstParticipant[f];
            if (hasFieldInFirst) {
                choice[f] = firstParticipant.id;
                return;
            }

            const found = active.slice(1).find(p => p[f]);
            choice[f] = found ? found.id : firstParticipant.id;
        });
        console.log("ddddddddddd                " + JSON.stringify(choice))

        return choice;
    }


    // const [choices, setChoices] = React.useState<Record<string, string | null>>(() => computeInitialChoices(activeList()));
    const [choices, setChoices] = React.useState<MergeChoiceMap>(() => computeInitialChoices(activeList()));
    const [selectedRoles, setSelectedRoles] = React.useState<Record<string, boolean>>(() => {
        const map: Record<string, boolean> = {};
        participants.forEach(p => p.roles.forEach(r => map[`${p.id}:${r.eventId}:${r.role}`] = true));
        return map;
    });

    React.useEffect(() => {
        const active = activeList();
        setChoices(prev => {
            // const keys = Object.keys(prev);
            const availableIds = new Set(active.map(a => a.id));
            let changed = false;
            // const next: Record<string, string | null> = {};
            const next = {} as MergeChoiceMap;
            const fallbackChoices = computeInitialChoices(active);
            fields.forEach((k) => {
                if (prev[k] && availableIds.has(prev[k])) next[k] = prev[k];
                else { next[k] = fallbackChoices[k]; changed = true; }
            });
            return changed ? next : prev;
        });
    }, [targetId, selectedSourceIds.join(',')]);

    function onChooseField(field: string, participantId: string) {
        setChoices(c => ({ ...c, [field]: participantId }));
        setOstatnio(prev => new Map(prev).set(participantId, new Date()));
    }

    function toggleRoleKey(key: string) { setSelectedRoles(m => ({ ...m, [key]: !m[key] })); }

    function computeMerged() {
        const merged: any = { id: targetId, mergedFrom: selectedSourceIds.slice(), sources: selectedSourceIds.slice() };
        fields.forEach(f => {
            const chosenPid = choices[f];
            const p = getParticipant(chosenPid || undefined as any);
            merged[f] = p ? (p as any)[f] : null;
        });
        const mergedRoles: any[] = [];
        Object.keys(selectedRoles).forEach(key => {
            if (selectedRoles[key]) {
                const [pid, eventId, role] = key.split(':');
                mergedRoles.push({ eventId, role, fromParticipant: pid });
            }
        });
        const uniq: any[] = [];
        mergedRoles.forEach(r => {
            if (!uniq.find(u => u.eventId === r.eventId && u.role === r.role)) uniq.push(r);
        });
        merged.roles = uniq;
        merged.events = Array.from(new Set(uniq.map(r => r.eventId)));
        mergeParticipant(targetId, merged).then(result => {
            console.log('Merge successful:', result);
            setLastMerged(result); // Aktualizuj stan, aby pokazać wynik
        }).catch(error => {
            alert('Merge failed: ' + error.message);
        });
        console.log("MERGED RESULT: " + JSON.stringify(merged, null, 2));
        return merged;
    }

    const [lastMerged, setLastMerged] = React.useState<any | null>(null);
    function doMerge() {
        const mergedLocal = computeMerged();
        (async () => {
            const fieldResolution = Object.fromEntries(fields.map(f => [f, choices[f]]));
            const payload = { sourceIds: selectedSourceIds, fieldResolution };
            const remote = await apiPostMerge(targetId, payload);
            if (remote) setLastMerged(remote);
            else setLastMerged(mergedLocal);
        })();
    }

    function resetAll() {
        setTargetId(participants[0].id);
        setSelectedSourceIds(participants.slice(1).map(p => p.id));
        setChoices(computeInitialChoices([participants[0], ...participants.slice(1)]));
        const map: Record<string, boolean> = {};
        participants.forEach(p => p.roles.forEach(r => map[`${p.id}:${r.eventId}:${r.role}`] = true));
        setSelectedRoles(map);
        setLastMerged(null);
    }
    type Info = "ko" | "cw" | "p"
    const [info, setInfo] = useState<Info>("p")
    const active = activeList();
    const optionsByField = fields.reduce<Record<string, { id: string, label: string, value: any }[]>>
        ((acc, f) => {
            acc[f] = active.map(p => ({
                id: p.id,
                label: `${p.id}${p.id === targetId ? ' (target)' : ''}`,
                value: (p as any)[f]
            }));
            return acc;
        }, {});
    const getFieldsSetForId = (id: string): MergeField[] => {
        const selectedFields = fields.filter(f => choices[f] === id);
        return [...new Set(selectedFields)].sort().reverse();
    };
    const czywogole = (id: string) => {
        return fields.some(t => choices[t] == id)
    }
    const [ostatnio, setOstatnio] = useState<Map<string, Date>>(new Map([]))
    const kiedyOstatnio = (id: string): Date | undefined => {
        return ostatnio.get(id);
    }
    // Użycie:
    type A = { type: "p", p: (id: string) => MergeField[] }
    type B = { type: "cw", p: (id: string) => boolean }
    type C = { type: "ko", p: (id: string) => Date | undefined }

    type ABC = A | B | C

    type Rest<ABC> = {
        active: Participant[],
        op: Info,
        info: ABC
    }
    const dataSources: Record<string, ABC> = {
        ko: { type: "ko", p: (id) => new Date() }, // Kiedy ostatnio
        cw: { type: "cw", p: (id) => true },       // Czy w ogóle
        p: { type: "p", p: (id) => getFieldsSetForId(id) } // Posortowane
    };

    // Użycie:
    const RestOfSource = <T extends ABC>({ active, info }: Rest<T>) => {
        if (!active || !Array.isArray(active)) return null;

        return (
            <>
                {/* 1. Pierwszy element zawsze na górze (jeśli taki był zamysł) */}
                <div className="participant-tag">
                    {active[0]?.id} — {active[0]?.firstName} {active[0]?.lastName}
                </div>

                {/* 2. Reszta posortowana */}
                {[...active.slice(1)] // slice(1) żeby nie powtarzać pierwszego elementu
                    .sort((a, b) => {
                        const resA = info.p(a.id);
                        const resB = info.p(b.id);

                        // Sortujemy zależnie od tego, co faktycznie jest w środku
                        if (Array.isArray(resA) && Array.isArray(resB)) {
                            return resB.length - resA.length;
                        }
                        if (resA instanceof Date && resB instanceof Date) {
                            return resB.getTime() - resA.getTime();
                        }
                        return 0;
                    })
                    .map(t => {
                        const result = info.p(t.id);

                        const renderResultText = () => {
                            if (Array.isArray(result)) return ` (${result.join(', ')})`;
                            if (result instanceof Date) return ` (${result.toLocaleTimeString()})`;
                            if (typeof result === 'boolean') return ` (${result ? 'Tak' : 'Nie'})`;
                            return null;
                        };

                        return (
                            <div key={t.id} className="participant-tag">
                                {t.id} — {t.firstName} {t.lastName}
                                {renderResultText()}
                            </div>
                        );
                    })}
            </>
        );
    };

    const dataHandlers = {
        "p": (id: string) => getFieldsSetForId(id),
        "cw": (id: string) => czywogole(id),
        "ko": (id: string) => new Date()
    };

    // Typ kluczy (np. 'fields' | 'status' | 'lastSeen')
    type HandlerKey = keyof typeof dataHandlers;

    // Najpierw zdefiniuj typ tego, co zwracają Twoje handlery
    type HandlerReturnType = ReturnType<typeof dataHandlers[HandlerKey]>;
    const t: HandlerReturnType = ["personalId", "personalId"]
    interface RestOfSourceProps<T> {
        participants: Participant[]; // Lista osób (stały typ)
        selectedSourceIds: string[],
        info1: (id: string) => T;    // Funkcja zwracająca "coś" (typ T)
    }
    const formatResult = (result: unknown): string => {
        if (result instanceof Date) return result.toLocaleTimeString();
        if (result instanceof Set) return Array.from(result).join(", ");
        if (Array.isArray(result)) return result.join(", ");
        if (typeof result === 'boolean') return result ? "Tak" : "Nie";
        return String(result ?? "");
    };

    // Komponent jest teraz "głupi" i tylko wyświetla dane
    function RestOfSource1<T>({ participants, selectedSourceIds, info1 }: RestOfSourceProps<T>) {
        return (
            <div>
                {participants.map((p) => (
                    <div key={p.id} className="participant-row">
                        {`${p.firstName}::${p.lastName}`}
                        <span className="result-value">
                            {selectedSourceIds.includes(p.id)
                                ? formatResult(info1(p.id))
                                : "Ukryte"}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="cp-container">
            // Użycie dla wersji z datą:
            <RestOfSource1<HandlerReturnType> // Jawnie podajemy typ T
                participants={active}
                selectedSourceIds={selectedSourceIds}
                info1={dataHandlers[info as HandlerKey] as (id: string) => HandlerReturnType}
            />

            <h3>Porównanie uczestników — podgląd MERGE (wielu źródeł)</h3>
            <p className="cp-text-muted">Interaktywny demo widok: wybierz target (rekord docelowy), wybierz które
                źródła chcesz scalić, dla każdego pola wskaż, którą wartość zachować,
                a następnie kliknij <strong>Merge</strong>.</p>

            <div className="cp-layout">
                <div className="cp-main">
                    <div className="cp-card cp-mb-2"><div className="cp-card-body">
                        <h6>Wybór rekordów</h6>
                        <div className="cp-mb-2">
                            <div className="cp-small cp-text-muted">Wybierz target (rekord docelowy):</div>
                            {participants.map(p => (
                                <label className="cp-check-inline cp-me-3" key={p.id}>
                                    <input className="cp-check-input" type="radio" name="target" checked={targetId === p.id} onChange={() => setTargetId(p.id)} />
                                    <span className="cp-label-gap">{p.id} — {p.firstName} {p.lastName}</span>
                                </label>
                            ))}
                        </div>
                        <div>
                            <div className="cp-small cp-text-muted">Wybierz źródła do scalenia (można wybrać wiele):</div>
                            {participants.filter(p => p.id !== targetId).map(p => (
                                <label className="cp-check-inline cp-me-3" key={p.id}>
                                    <input className="cp-check-input" type="checkbox" checked={selectedSourceIds.includes(p.id)} onChange={() => toggleSource(p.id)} />
                                    <span className="cp-label-gap">{p.id} — {p.firstName} {p.lastName}</span>
                                </label>
                            ))}
                        </div>
                    </div></div>

                    <table className="cp-table">
                        <thead className="cp-table-head"><tr><th>Pole</th><th colSpan={3}></th></tr></thead>
                        <tbody>
                            {fields.map(f => (
                                <FieldRowMulti key={f} name={f} options={optionsByField[f]} choice={choices[f]} onChoose={(pid) => onChooseField(f, pid)} />
                            ))}
                        </tbody>
                    </table>

                    <div className="cp-mb-3">
                        <h6>Role (wybierz które przenieść)</h6>
                        <div className="cp-inline-group cp-gap-3">
                            {participants.flatMap(p => p.roles.map(r => ({ key: `${p.id}:${r.eventId}:${r.role}`, label: `${r.role} (event ${r.eventId}) — from ${p.id}` }))).map((item, i) => (
                                <label className="cp-check-inline" key={`${item.key}:${i}`}>
                                    <input className="cp-check-input" type="checkbox" checked={!!selectedRoles[item.key]} onChange={() => toggleRoleKey(item.key)} />
                                    <span className="cp-label-gap">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="cp-mb-3">
                        <button className="cp-btn cp-btn-primary cp-me-2" onClick={doMerge}>Merge</button>
                        <button className="cp-btn cp-btn-secondary" onClick={resetAll}>Reset</button>
                    </div>

                    {lastMerged && (
                        <div>
                            <h6>Wynik merge</h6>
                            <pre>{JSON.stringify(lastMerged, null, 2)}</pre>
                            <button className="cp-btn cp-btn-outline-primary cp-btn-sm cp-me-2" onClick={() => {
                                const blob = new Blob([JSON.stringify(lastMerged, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'merged-participant.json'; a.click(); URL.revokeObjectURL(url);
                            }}>Pobierz JSON</button>
                            <button className="cp-btn cp-btn-outline-danger cp-btn-sm" onClick={() => { setLastMerged(null); }}>Ukryj</button>
                            <button className="cp-btn cp-btn-outline-secondary cp-btn-sm cp-ms-2" onClick={() => {
                                mergeParticipant(targetId, MergeRequest).then(result => {
                                    console.log('Merge successful:', result);
                                    setLastMerged(result); // Aktualizuj stan, aby pokazać wynik
                                }).catch(error => {
                                    alert('Merge failed: ' + error.message);
                                });
                            }}>Wywołaj API MERGE</button>
                        </div>
                    )}

                </div>

                <div className="cp-side">
                    <div className="cp-card cp-mb-3"><div className="cp-card-body">
                        <h6>Informacje</h6>
                        <p onClick={() => setInfo("p")}>posortowane</p>
                        <p onClick={() => setInfo("cw")}>czy wogole</p>
                        <p onClick={() => setInfo("ko")}>kiedy ostatnio</p>
                        <p className="cp-small cp-text-muted">Target ID: <strong>{targetId}</strong></p>
                        <p className="cp-small"><strong>Wybrane źródła:</strong><br />{selectedSourceIds.join(', ') || '(brak)'}</p>
                        <p className="cp-small cp-text-muted">Active list (target + sources):</p>


                        {/* 1. Pierwszy element (bez sortowania) */}

                        <RestOfSource
                            active={active}
                            op={info}
                            info={dataSources[info]}
                        />

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
}

export default CompareParticipants
