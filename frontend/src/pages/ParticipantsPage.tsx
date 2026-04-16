import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '../api/participants';
import { GenericTable } from '../components/GenericTable';
import type { ColumnDef } from '../components/GenericTable';
import type { ParticipantDTO } from '../api/types';
import { useCallback, useState } from 'react';
import { memo } from 'react';
const columns: ColumnDef<ParticipantDTO>[] = [
    { header: 'ID', accessor: (r) => r.id },
    { header: 'First Name', accessor: (r) => r.firstName },
    { header: 'Last Name', accessor: (r) => r.lastName },
    { header: 'Personal ID', accessor: (r) => r.personalId },
    {
        header: 'Vehicle',
        accessor: (r) =>
            r.vehicle
                ? `${r.vehicle.make} ${r.vehicle.model} (${r.vehicle.licensePlate})`
                : '—',
    },
    {
        header: 'Roles',
        accessor: (r) =>
            r.roles.length > 0 ? r.roles.map((role) => role.roleName).join(', ') : '—',
    },
];

export default function ParticipantsPage() {
    const [enc, setEnc] = useState(0);
    const handleEncClick = useCallback(() => {
        setEnc((p) => p + 1);
    }, []);

    const { data, isLoading, isError, error } = useQuery<ParticipantDTO[]>({
        queryKey: ['participants'],
        queryFn: fetchParticipants,
    });

    if (isLoading) return <p>Loading participants…</p>;
    if (isError) return <p style={{ color: 'red' }}>Error: {String(error)}</p>;







    return (
        <div>
            <h2>Participants</h2>
            <div style={{ marginBottom: '1em', color: '#555' }} onClick={handleEncClick}>M
                {enc}Total participants: {data?.length ?? 0}
            </div>
            <GenericTable<ParticipantDTO>
                num={enc}
                columns={columns}
                data={data ?? []}
                keyExtractor={(r) => r.id}
            />
        </div>
    );
}
