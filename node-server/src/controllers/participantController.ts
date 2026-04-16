import { Router, Request, Response } from 'express';
import * as service from '../services/participantService';
import type { ParticipantDTO } from '../types/dto';

const router = Router();

// NEW (mid): lightweight request validation helpers.
function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

// NEW (mid): runtime validation for create payload.
function validateParticipantPayload(body: unknown): { ok: true; dto: Omit<ParticipantDTO, 'id'> } | { ok: false; message: string } {
    if (!body || typeof body !== 'object') {
        return { ok: false, message: 'Body must be a JSON object' };
    }

    const dto = body as Partial<ParticipantDTO>;
    if (!isNonEmptyString(dto.firstName)) {
        return { ok: false, message: 'firstName is required' };
    }
    if (!isNonEmptyString(dto.lastName)) {
        return { ok: false, message: 'lastName is required' };
    }

    return {
        ok: true,
        dto: {
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            personalId: typeof dto.personalId === 'string' ? dto.personalId.trim() : undefined,
            vehicle: dto.vehicle ?? null,
            roles: Array.isArray(dto.roles) ? dto.roles : [],
        },
    };
}

// GET /api/participants
router.get('/', async (_req: Request, res: Response) => {




    try {
        const participants = await service.getAllParticipants();
        console.info(`REST 200 OK: GET /api/participants returned ${participants.length} participant(s).`);
        res.json(participants);
    } catch (err) {
        console.error('GET /api/participants failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/participants/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        // NEW (mid): fail fast on invalid route param.
        if (!isNonEmptyString(req.params.id)) {
            return res.status(400).json({ error: 'Participant id is required' });
        }

        const participant = await service.getParticipantById(req.params.id);
        if (!participant) return res.status(404).json({ error: 'Participant not found' });
        console.info(`REST 200 OK: GET /api/participants/${req.params.id} returned participant.`);
        res.json(participant);
    } catch (err) {
        console.error(`GET /api/participants/${req.params.id} failed:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/participants
router.post('/', async (req: Request, res: Response) => {
    try {
        // NEW (mid): validate payload before hitting service/database.
        const validated = validateParticipantPayload(req.body);
        if (!validated.ok) {
            return res.status(400).json({ error: validated.message });
        }

        const created = await service.createParticipant(validated.dto);
        res.status(201).json(created);
    } catch (err) {
        console.error('POST /api/participants failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
