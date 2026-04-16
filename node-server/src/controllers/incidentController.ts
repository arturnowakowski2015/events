import { Router, Request, Response } from 'express';
import * as service from '../services/incidentService';
import type { IncidentDTO } from '../types/dto';

const router = Router();

// NEW (mid): lightweight validation helpers.
function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

// NEW (mid): runtime validation for incident create payload.
function validateIncidentPayload(body: unknown): { ok: true; dto: Omit<IncidentDTO, 'incidentId'> } | { ok: false; message: string } {
    if (!body || typeof body !== 'object') {
        return { ok: false, message: 'Body must be a JSON object' };
    }

    const dto = body as Partial<IncidentDTO>;
    if (!isNonEmptyString(dto.dateTime)) {
        return { ok: false, message: 'dateTime is required' };
    }

    return {
        ok: true,
        dto: {
            dateTime: dto.dateTime.trim(),
            locationDescription: typeof dto.locationDescription === 'string' ? dto.locationDescription.trim() : undefined,
            eventType: typeof dto.eventType === 'string' ? dto.eventType.trim() : undefined,
            participants: Array.isArray(dto.participants) ? dto.participants : [],
            telemetry: dto.telemetry ?? null,
        },
    };
}

// GET /api/incidents
router.get('/', async (_req: Request, res: Response) => {
    try {
        const incidents = await service.getAllIncidents();
        res.json(incidents);
    } catch (err) {
        console.error('GET /api/incidents failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/incidents/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        // NEW (mid): fail fast on invalid route param.
        if (!isNonEmptyString(req.params.id)) {
            return res.status(400).json({ error: 'Incident id is required' });
        }

        const incident = await service.getIncidentById(req.params.id);
        if (!incident) return res.status(404).json({ error: 'Incident not found' });
        res.json(incident);
    } catch (err) {
        console.error(`GET /api/incidents/${req.params.id} failed:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/incidents
router.post('/', async (req: Request, res: Response) => {
    try {
        // NEW (mid): validate payload before service/database operations.
        const validated = validateIncidentPayload(req.body);
        if (!validated.ok) {
            return res.status(400).json({ error: validated.message });
        }

        const created = await service.createIncident(validated.dto);
        res.status(201).json(created);
    } catch (err) {
        console.error('POST /api/incidents failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
