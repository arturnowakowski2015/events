import { pool } from '../db/pool';
import { v4 as uuidv4 } from 'uuid';
import type { IncidentDTO, ParticipantDTO } from '../types/dto';

export async function getAllIncidents(): Promise<IncidentDTO[]> {
    const result = await pool.query(`
        SELECT
            i.incident_id, i.date_time, i.location_description, i.event_type,
            t.telemetry_type, t.speed_at_impact, t.g_force, t.latitude, t.longitude, t.precise_time,
            t.speed, t.rpm, t.fuel_level,
            p.id AS p_id, p.first_name, p.last_name, p.personal_id,
            v.make, v.model, v.license_plate, v.vin, v.insurance_policy_number,
            r.role_name, r.description AS role_description
        FROM incidents i
        LEFT JOIN telemetry_data t ON t.incident_id = i.incident_id
        LEFT JOIN incident_participants ip ON ip.incident_id = i.incident_id
        LEFT JOIN participants p ON p.id = ip.participant_id
        LEFT JOIN vehicles v ON v.participant_id = p.id
        LEFT JOIN participant_roles pr ON pr.participant_id = p.id
        LEFT JOIN roles r ON r.id = pr.role_id
        ORDER BY i.date_time DESC
    `);

    return aggregateIncidents(result.rows);
}

export async function getIncidentById(id: string): Promise<IncidentDTO | null> {
    const result = await pool.query(`
        SELECT
            i.incident_id, i.date_time, i.location_description, i.event_type,
            t.telemetry_type, t.speed_at_impact, t.g_force, t.latitude, t.longitude, t.precise_time,
            t.speed, t.rpm, t.fuel_level,
            p.id AS p_id, p.first_name, p.last_name, p.personal_id,
            v.make, v.model, v.license_plate, v.vin, v.insurance_policy_number,
            r.role_name, r.description AS role_description
        FROM incidents i
        LEFT JOIN telemetry_data t ON t.incident_id = i.incident_id
        LEFT JOIN incident_participants ip ON ip.incident_id = i.incident_id
        LEFT JOIN participants p ON p.id = ip.participant_id
        LEFT JOIN vehicles v ON v.participant_id = p.id
        LEFT JOIN participant_roles pr ON pr.participant_id = p.id
        LEFT JOIN roles r ON r.id = pr.role_id
        WHERE i.incident_id = $1
    `, [id]);

    if (result.rows.length === 0) return null;
    return aggregateIncidents(result.rows)[0];
}

export async function createIncident(dto: Omit<IncidentDTO, 'incidentId'>): Promise<IncidentDTO> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const incidentId = uuidv4();
        await client.query(
            `INSERT INTO incidents (incident_id, date_time, location_description, event_type)
             VALUES ($1, $2, $3, $4)`,
            [incidentId, dto.dateTime, dto.locationDescription ?? null, dto.eventType ?? null]
        );

        if (dto.telemetry) {
            const t = dto.telemetry;
            await client.query(
                `INSERT INTO telemetry_data
                 (id, incident_id, telemetry_type, speed_at_impact, g_force, latitude, longitude, precise_time, speed, rpm, fuel_level)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
                [uuidv4(), incidentId, t.type,
                 t.speedAtImpact ?? null, t.gForce ?? null, t.latitude ?? null, t.longitude ?? null,
                 t.preciseTime ?? null, t.speed ?? null, t.rpm ?? null, t.fuelLevel ?? null]
            );
        }

        for (const p of dto.participants ?? []) {
            let participantId = p.id;
            if (!participantId) {
                participantId = uuidv4();
                await client.query(
                    `INSERT INTO participants (id, first_name, last_name, personal_id) VALUES ($1,$2,$3,$4)`,
                    [participantId, p.firstName, p.lastName, p.personalId ?? null]
                );
                if (p.vehicle) {
                    await client.query(
                        `INSERT INTO vehicles (id, participant_id, make, model, license_plate, vin, insurance_policy_number)
                         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                        [uuidv4(), participantId, p.vehicle.make, p.vehicle.model, p.vehicle.licensePlate,
                         p.vehicle.vin, p.vehicle.insurancePolicyNumber]
                    );
                }
            }
            await client.query(
                `INSERT INTO incident_participants (incident_id, participant_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
                [incidentId, participantId]
            );
        }

        await client.query('COMMIT');
        return { incidentId, ...dto };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

// ── helpers ──────────────────────────────────────────────────────────────────

type RawRow = Record<string, unknown>;

function aggregateIncidents(rows: RawRow[]): IncidentDTO[] {
    const incidents = new Map<string, IncidentDTO>();
    const incidentParticipants = new Map<string, Map<string, ParticipantDTO>>();

    for (const row of rows) {
        const iid = row.incident_id as string;

        if (!incidents.has(iid)) {
            incidents.set(iid, {
                incidentId: iid,
                dateTime: row.date_time as string,
                locationDescription: row.location_description as string,
                eventType: row.event_type as string,
                participants: [],
                telemetry: row.telemetry_type ? {
                    type: row.telemetry_type as 'CRASH' | 'VEHICLE',
                    speedAtImpact: row.speed_at_impact as number,
                    gForce: row.g_force as number,
                    latitude: row.latitude as number,
                    longitude: row.longitude as number,
                    preciseTime: row.precise_time as string,
                    speed: row.speed as number,
                    rpm: row.rpm as number,
                    fuelLevel: row.fuel_level as number,
                } : null,
            });
            incidentParticipants.set(iid, new Map());
        }

        const pid = row.p_id as string;
        if (pid) {
            const pMap = incidentParticipants.get(iid)!;
            if (!pMap.has(pid)) {
                pMap.set(pid, {
                    id: pid,
                    firstName: row.first_name as string,
                    lastName: row.last_name as string,
                    personalId: row.personal_id as string,
                    vehicle: row.make ? {
                        make: row.make as string,
                        model: row.model as string,
                        licensePlate: row.license_plate as string,
                        vin: row.vin as string,
                        insurancePolicyNumber: row.insurance_policy_number as string,
                    } : null,
                    roles: [],
                });
            }
            if (row.role_name) {
                pMap.get(pid)!.roles.push({
                    roleName: row.role_name as string,
                    description: row.role_description as string,
                });
            }
        }
    }

    for (const [iid, incident] of incidents) {
        incident.participants = [...incidentParticipants.get(iid)!.values()];
    }

    return [...incidents.values()];
}
