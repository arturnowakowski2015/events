import axios from 'axios';
import type { ParticipantDTO } from './types';

const BASE = 'http://localhost:8080/api/participants';

export const fetchParticipants = async (): Promise<ParticipantDTO[]> => {
    try {
        const { data, status } = await axios.get<ParticipantDTO[]>(BASE);
        if (status === 200) {
            console.info('REST 200 OK: participants loaded successfully.');
        }
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching participants:', error);
        return [];
    }
};

export const createParticipant = async (dto: Omit<ParticipantDTO, 'id'>): Promise<ParticipantDTO> => {
    try {
        const { data, status } = await axios.post<ParticipantDTO>(BASE, dto);
        if (status === 201) {
            console.info('REST 201 Created: participant created successfully.');
        }
        return data;
    } catch (error) {
        console.error('Error creating participant:', error);
        throw error;
    }
};


// src/services/mergeService.ts

export type FieldResolution = Record<string, string>;
export type MergeRequest = {
    sourceIds?: string[];
    fieldResolution?: FieldResolution;
};

export async function mergeParticipant(
    targetId: string,
    body: MergeRequest,
    options?: { signal?: AbortSignal }
): Promise<Record<string, any>> {
    const url = `${BASE}/${encodeURIComponent(targetId)}/merge`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // dodaj Authorization jeśli potrzebujesz: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
        signal: options?.signal
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => null);
        let errMsg = `Failed to merge participant. HTTP ${resp.status}`;
        if (text) errMsg += `: ${text}`;
        throw new Error(errMsg);
    }

    // oczekujemy JSON z obiektem scalenia
    const data = await resp.json();
    return data;
}


// 200
// OK
// 201
// Created
// 204
// No Content
// 400
// Bad Request
// 401
// Unauthorized
// 403
// Forbidden
// 404
// Not Found
// 500
// Internal Server Error