import React from 'react';
import ReactDOM from 'react-dom/client';

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
    roles: [ { eventId: 'e-1', role: 'Victim' }, { eventId: 'e-2', role: 'Witness' } ],
    events: [ 'e-1', 'e-2' ]
  },
  {
    id: 'p-999',
    personalId: 'ABC123456',
    firstName: 'Janusz',
    lastName: 'Kowalski',
    phone: null,
    email: 'j.kowalski@example.com',
    address: 'ul. Główna 1, 00-001 Miasto',
    roles: [ { eventId: 'e-3', role: 'Perpetrator' } ],
    events: [ 'e-3' ]
  },
  {
    id: 'p-500',
    personalId: 'ABC123456',
    firstName: 'Jan',
    lastName: 'Kowalski',
    phone: '+48 600 700 801',
    email: null,
    address: null,
    roles: [ { eventId: 'e-4', role: 'Officer' } ],
    events: [ 'e-4' ]
  }
];

async function apiFetchParticipants(personalId?: string): Promise<Participant[]> {
  try{
    const url = personalId ? `/api/participants?personalId=${encodeURIComponent(personalId)}` : '/api/participants';
    const r = await fetch(url);
    if(!r.ok) throw new Error('Network');
    const json = await r.json();
    return Array.isArray(json) ? (json as Participant[]) : sampleParticipants;
  }catch(e){
    console.warn('Falling back to sample participants', e);
    return sampleParticipants;
  }
}

async function apiPostMerge(targetId: string, payload: any): Promise<any | null> {
  try{
    const r = await fetch(`/api/participants/${encodeURIComponent(targetId)}/merge`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if(!r.ok) throw new Error('Merge failed');
    return await r.json();
  }catch(e){
    console.warn('Merge fallback (local compute) due to', e);
    return null;
  }
}

const fields = ['personalId','firstName','lastName','phone','email','address'];

function FieldRowMulti({name, options, choice, onChoose}: { name: string; options: {id:string,label:string,value:any}[]; choice?: string | null; onChoose:(id:string)=>void }){
  const valuesMap = options.reduce<Record<string, any>>((acc,o)=>{ acc[o.id]=o.value===null? '': o.value; return acc; }, {});
  const differs = new Set(Object.values(valuesMap)).size > 1;
  return (
    <tr className={differs ? 'diff' : ''}>
      <td className="field-key">{name}</td>
      <td colSpan={3}>
        <div className="d-flex gap-2 align-items-start flex-wrap">
          {options.map(o => (
            <label key={o.id} className="form-check form-check-inline mb-1">
              <input className="form-check-input" type="radio" name={name} checked={choice===o.id} onChange={()=>onChoose(o.id)} />
              <span className="ms-1 participant-tag">{o.label}</span>
              <span className="ms-1">{String(o.value===null? '' : o.value)}</span>
            </label>
          ))}
        </div>
      </td>
    </tr>
  );
}

function ComparisonAppMulti(): JSX.Element{
  const [participants, setParticipants] = React.useState<Participant[]>(sampleParticipants);
  const [targetId, setTargetId] = React.useState<string>(participants[0].id);
  const [selectedSourceIds, setSelectedSourceIds] = React.useState<string[]>(() => participants.slice(1).map(p=>p.id));

  React.useEffect(()=>{
    (async ()=>{
      const list = await apiFetchParticipants();
      if(Array.isArray(list) && list.length>0 && typeof list[0] === 'object'){
        setParticipants(list.map(p=> ({
          id: p.id,
          firstName: p.firstName ?? '',
          lastName: p.lastName ?? '',
          personalId: p.personalId ?? '',
          phone: p.phone ?? null,
          email: p.email ?? null,
          address: p.address ?? null,
          roles: (p.roles || []).map(r=> ({ eventId: r.eventId || 'unknown', role: r.role || r['description'] || 'role' })),
          events: (p.events || [])
        })));
      }
    })();
  }, []);

  function toggleSource(id: string){
    setSelectedSourceIds(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  }

  function getParticipant(id?: string | null){
    return participants.find(p=>p.id===id);
  }

  function activeList(){
    const list: Participant[] = [];
    const t = getParticipant(targetId);
    if(t) list.push(t);
    participants.forEach(p=>{ if(p.id!==targetId && selectedSourceIds.includes(p.id)) list.push(p); });
    return list;
  }

  function computeInitialChoices(active: Participant[]){
    const choice: Record<string,string|null> = {};
    fields.forEach(f => {
      const t = active[0] && (active[0] as any)[f] ? (active[0] as any)[f] : null;
      if(t) { choice[f] = active[0].id; return; }
      const found = active.slice(1).find(p => (p as any)[f]);
      choice[f] = found ? found.id : (active[0] ? active[0].id : null);
    });
    return choice;
  }

  const [choices, setChoices] = React.useState<Record<string,string|null>>(() => computeInitialChoices(activeList()));
  const [selectedRoles, setSelectedRoles] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string,boolean> = {};
    participants.forEach(p=> p.roles.forEach(r=> map[`${p.id}:${r.eventId}:${r.role}`] = true));
    return map;
  });

  React.useEffect(()=>{
    const active = activeList();
    setChoices(prev => {
      const keys = Object.keys(prev);
      const availableIds = new Set(active.map(a=>a.id));
      let changed = false;
      const next: Record<string,string|null> = {};
      keys.forEach(k => {
        if(prev[k] && availableIds.has(prev[k]!)) next[k]=prev[k];
        else { next[k] = computeInitialChoices(active)[k]; changed = true; }
      });
      return changed ? next : prev;
    });
  }, [targetId, selectedSourceIds.join(',')] );

  function onChooseField(field: string, participantId: string){
    setChoices(c => ({...c, [field]: participantId}));
  }

  function toggleRoleKey(key: string){ setSelectedRoles(m => ({...m, [key]: !m[key]})); }

  function computeMerged(){
    const active = activeList();
    const merged: any = { id: targetId, mergedFrom: selectedSourceIds.slice(), sources: selectedSourceIds.slice() };
    fields.forEach(f => {
      const chosenPid = choices[f];
      const p = getParticipant(chosenPid || undefined as any);
      merged[f] = p ? (p as any)[f] : null;
    });
    const mergedRoles: any[] = [];
    Object.keys(selectedRoles).forEach(key => {
      if(selectedRoles[key]){
        const [pid, eventId, role] = key.split(':');
        mergedRoles.push({ eventId, role, fromParticipant: pid });
      }
    });
    const uniq: any[] = [];
    mergedRoles.forEach(r=>{
      if(!uniq.find(u=>u.eventId===r.eventId && u.role===r.role)) uniq.push(r);
    });
    merged.roles = uniq;
    merged.events = Array.from(new Set(uniq.map(r=>r.eventId)));
    return merged;
  }

  const [lastMerged, setLastMerged] = React.useState<any | null>(null);
  function doMerge(){
    const mergedLocal = computeMerged();
    (async ()=>{
      const fieldResolution = Object.fromEntries(fields.map(f=> [f, choices[f]]));
      const payload = { sourceIds: selectedSourceIds, fieldResolution };
      const remote = await apiPostMerge(targetId, payload);
      if(remote) setLastMerged(remote);
      else setLastMerged(mergedLocal);
    })();
  }

  function resetAll(){
    setTargetId(participants[0].id);
    setSelectedSourceIds(participants.slice(1).map(p=>p.id));
    setChoices(computeInitialChoices([participants[0], ...participants.slice(1)]));
    const map: Record<string,boolean> = {};
    participants.forEach(p=> p.roles.forEach(r=> map[`${p.id}:${r.eventId}:${r.role}`] = true));
    setSelectedRoles(map);
    setLastMerged(null);
  }

  const active = activeList();
  const optionsByField = fields.reduce<Record<string, {id:string,label:string,value:any}[]>>((acc,f)=>{
    acc[f] = active.map(p=>({ id: p.id, label: `${p.id}${p.id===targetId? ' (target)':''}`, value: (p as any)[f] }));
    return acc;
  }, {});

  return (
    <div className="container py-4">
      <h3>Porównanie uczestników — podgląd MERGE (wielu źródeł)</h3>
      <p className="text-muted">Interaktywny demo widok: wybierz target (rekord docelowy), wybierz które źródła chcesz scalić, dla każdego pola wskaż, którą wartość zachować, a następnie kliknij <strong>Merge</strong>.</p>

      <div className="row mb-3">
        <div className="col-md-8">
          <div className="card mb-2"><div className="card-body">
            <h6>Wybór rekordów</h6>
            <div className="mb-2">
              <div className="small text-muted">Wybierz target (rekord docelowy):</div>
              {participants.map(p=> (
                <label className="form-check form-check-inline me-3" key={p.id}>
                  <input className="form-check-input" type="radio" name="target" checked={targetId===p.id} onChange={()=>setTargetId(p.id)} />
                  <span className="ms-1">{p.id} — {p.firstName} {p.lastName}</span>
                </label>
              ))}
            </div>
            <div>
              <div className="small text-muted">Wybierz źródła do scalenia (można wybrać wiele):</div>
              {participants.filter(p=>p.id!==targetId).map(p=> (
                <label className="form-check form-check-inline me-3" key={p.id}>
                  <input className="form-check-input" type="checkbox" checked={selectedSourceIds.includes(p.id)} onChange={()=>toggleSource(p.id)} />
                  <span className="ms-1">{p.id} — {p.firstName} {p.lastName}</span>
                </label>
              ))}
            </div>
          </div></div>

          <table className="table table-sm table-bordered">
            <thead className="table-light"><tr><th>Pole</th><th colSpan={3}></th></tr></thead>
            <tbody>
              {fields.map(f => (
                <FieldRowMulti key={f} name={f} options={optionsByField[f]} choice={choices[f]} onChoose={(pid)=>onChooseField(f,pid)} />
              ))}
            </tbody>
          </table>

          <div className="mb-3">
            <h6>Role (wybierz które przenieść)</h6>
            <div className="d-flex gap-3 flex-wrap">
              {participants.flatMap(p=> p.roles.map(r=> ({ key:`${p.id}:${r.eventId}:${r.role}`, label:`${r.role} (event ${r.eventId}) — from ${p.id}` }))).map(item=> (
                <label className="form-check form-check-inline" key={item.key}>
                  <input className="form-check-input" type="checkbox" checked={!!selectedRoles[item.key]} onChange={()=>toggleRoleKey(item.key)} />
                  <span className="form-check-label ms-1">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-primary me-2" onClick={doMerge}>Merge</button>
            <button className="btn btn-secondary" onClick={resetAll}>Reset</button>
          </div>

          {lastMerged && (
            <div>
              <h6>Wynik merge</h6>
              <pre>{JSON.stringify(lastMerged, null, 2)}</pre>
              <button className="btn btn-outline-primary btn-sm me-2" onClick={()=>{
                const blob = new Blob([JSON.stringify(lastMerged,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='merged-participant.json'; a.click(); URL.revokeObjectURL(url);
              }}>Pobierz JSON</button>
              <button className="btn btn-outline-danger btn-sm" onClick={()=>{ setLastMerged(null); }}>Ukryj</button>
            </div>
          )}

        </div>

        <div className="col-md-4">
          <div className="card mb-3"><div className="card-body">
            <h6>Informacje</h6>
            <p className="small text-muted">Target ID: <strong>{targetId}</strong></p>
            <p className="small"><strong>Wybrane źródła:</strong><br/>{selectedSourceIds.join(', ') || '(brak)'}</p>
            <p className="small text-muted">Active list (target + sources):</p>
            <div>
              {active.map(a=> (<div key={a.id} className="participant-tag">{a.id} — {a.firstName} {a.lastName}</div>))}
            </div>
          </div></div>

          <div className="card"><div className="card-body">
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

// mount if running in browser environment with an element having id 'root'
if(typeof document !== 'undefined'){
  const rootEl = document.getElementById('root');
  if(rootEl){
    const root = ReactDOM.createRoot(rootEl);
    root.render(<ComparisonAppMulti/>);
  }
}
