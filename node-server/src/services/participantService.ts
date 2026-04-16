import { pool } from '../db/pool';
import { v4 as uuidv4 } from 'uuid';
import type { ParticipantDTO } from '../types/dto';

export async function getAllParticipants(): Promise<ParticipantDTO[]> {
    const result = await pool.query<{
        id: string; first_name: string; last_name: string; personal_id: string;
        make: string; model: string; license_plate: string; vin: string; insurance_policy_number: string;
        role_name: string; description: string;
    }>(`
        SELECT
            p.id, p.first_name, p.last_name, p.personal_id,
            v.make, v.model, v.license_plate, v.vin, v.insurance_policy_number,
            r.role_name, r.description
        FROM participants p
        LEFT JOIN vehicles v ON v.participant_id = p.id
        LEFT JOIN participant_roles pr ON pr.participant_id = p.id
        LEFT JOIN roles r ON r.id = pr.role_id
        ORDER BY p.last_name, p.first_name
    `);

    const map = new Map<string, ParticipantDTO>();
    for (const row of result.rows) {
        if (!map.has(row.id)) {
            map.set(row.id, {
                id: row.id,
                firstName: row.first_name,
                lastName: row.last_name,
                personalId: row.personal_id,
                vehicle: row.make ? {
                    make: row.make,
                    model: row.model,
                    licensePlate: row.license_plate,
                    vin: row.vin,
                    insurancePolicyNumber: row.insurance_policy_number,
                } : null,
                roles: [],
            });
        }
        if (row.role_name) {
            map.get(row.id)!.roles.push({ roleName: row.role_name, description: row.description });
        }
    }
    return [...map.values()];
}

export async function getParticipantById(id: string): Promise<ParticipantDTO | null> {
    const result = await pool.query(`
        SELECT
            p.id, p.first_name, p.last_name, p.personal_id,
            v.make, v.model, v.license_plate, v.vin, v.insurance_policy_number,
            r.role_name, r.description
        FROM participants p
        LEFT JOIN vehicles v ON v.participant_id = p.id
        LEFT JOIN participant_roles pr ON pr.participant_id = p.id
        LEFT JOIN roles r ON r.id = pr.role_id
        WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const dto: ParticipantDTO = {
        id: result.rows[0].id,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        personalId: result.rows[0].personal_id,
        vehicle: result.rows[0].make ? {
            make: result.rows[0].make,
            model: result.rows[0].model,
            licensePlate: result.rows[0].license_plate,
            vin: result.rows[0].vin,
            insurancePolicyNumber: result.rows[0].insurance_policy_number,
        } : null,
        roles: [],
    };
    for (const row of result.rows) {
        if (row.role_name) dto.roles.push({ roleName: row.role_name, description: row.description });
    }
    return dto;
}

export async function createParticipant(dto: Omit<ParticipantDTO, 'id'>): Promise<ParticipantDTO> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const id = uuidv4();
        await client.query(
            `INSERT INTO participants (id, first_name, last_name, personal_id) VALUES ($1, $2, $3, $4)`,
            [id, dto.firstName, dto.lastName, dto.personalId ?? null]
        );

        if (dto.vehicle) {
            await client.query(
                `INSERT INTO vehicles (id, participant_id, make, model, license_plate, vin, insurance_policy_number)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [uuidv4(), id, dto.vehicle.make, dto.vehicle.model, dto.vehicle.licensePlate,
                 dto.vehicle.vin, dto.vehicle.insurancePolicyNumber]
            );
        }

        for (const role of dto.roles ?? []) {
            // upsert role by name
            const roleResult = await client.query(
                `INSERT INTO roles (id, role_name, description)
                 VALUES ($1, $2, $3)
                 ON CONFLICT DO NOTHING
                 RETURNING id`,
                [uuidv4(), role.roleName, role.description ?? null]
            );
            const roleId = roleResult.rows[0]?.id
                ?? (await client.query(`SELECT id FROM roles WHERE role_name = $1`, [role.roleName])).rows[0]?.id;

            if (roleId) {
                await client.query(
                    `INSERT INTO participant_roles (participant_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                    [id, roleId]
                );
            }
        }

        await client.query('COMMIT');
        return { id, ...dto };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}
