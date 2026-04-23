import axios from 'axios';
import type { ParticipantDTO, ParticipantPayload } from './types';

const BASE = 'http://localhost:8080/api/participants';

function toError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
        const message = typeof error.response?.data === 'string'
            ? error.response.data
            : error.message;
        return new Error(message || 'Participant request failed');
    }

    return error instanceof Error ? error : new Error('Participant request failed');
}

export const fetchParticipants = async (): Promise<ParticipantDTO[]> => {
    try {
        const { data } = await axios.get<ParticipantDTO[]>(BASE);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw toError(error);
    }
};

export const fetchParticipant = async (id: string): Promise<ParticipantDTO> => {
    try {
        const { data } = await axios.get<ParticipantDTO>(`${BASE}/${encodeURIComponent(id)}`);
        return data;
    } catch (error) {
        throw toError(error);
    }
};

export const createParticipant = async (dto: ParticipantPayload): Promise<ParticipantDTO> => {
    try {
        const { data } = await axios.post<ParticipantDTO>(BASE, dto);
        return data;
    } catch (error) {
        throw toError(error);
    }
};

export const updateParticipant = async (id: string, dto: ParticipantPayload): Promise<ParticipantDTO> => {
    try {
        const { data } = await axios.put<ParticipantDTO>(`${BASE}/${encodeURIComponent(id)}`, dto);
        return data;
    } catch (error) {
        throw toError(error);
    }
};

export const deleteParticipant = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${BASE}/${encodeURIComponent(id)}`);
    } catch (error) {
        throw toError(error);
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