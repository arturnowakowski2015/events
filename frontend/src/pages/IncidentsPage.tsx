import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '../api/incidents';
import { GenericTable } from '../components/GenericTable';
import type { ColumnDef } from '../components/GenericTable';
import type { IncidentDTO } from '../api/types';

const columns: ColumnDef<IncidentDTO>[] = [
    { header: 'ID', accessor: (r) => r.incidentId },
    {
        header: 'Date & Time',
        accessor: (r) => r.dateTime ? new Date(r.dateTime).toLocaleString() : '—',
    },
    { header: 'Location', accessor: (r) => r.locationDescription ?? '—' },
    {
        header: 'Participants',
        accessor: (r) =>
            r.participants.length > 0
                ? r.participants.map((p) => `${p.firstName} ${p.lastName}`).join(', ')
                : '—',
    },
    {
        header: 'Speed (telemetry)',
        accessor: (r) => (r.telemetry ? r.telemetry.speed : '—'),
    },
];

export default function IncidentsPage() {
    const { data, isLoading, isError, error } = useQuery<IncidentDTO[]>({
        queryKey: ['incidents'],
        queryFn: fetchIncidents,
    });

    if (isLoading) return <p>Loading incidents…</p>;
    if (isError) return <p style={{ color: 'red' }}>Error: {String(error)}</p>;

    return (
        <div>
            <h2>Incidents</h2>
            <GenericTable<IncidentDTO>
                num={data?.length ?? 0}
                columns={columns}
                data={data ?? []}
                keyExtractor={(r) => r.incidentId}
            />
        </div>
    );
}
