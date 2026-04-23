import axios from 'axios';
import type { IncidentDTO, IncidentPayload } from './types';

const BASE = 'http://localhost:8080/api/incidents';

function toError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
        const message = typeof error.response?.data === 'string'
            ? error.response.data
            : error.message;
        return new Error(message || 'Incident request failed');
    }

    return error instanceof Error ? error : new Error('Incident request failed');
}

export const fetchIncidents = async (): Promise<IncidentDTO[]> => {
    try {
        const { data } = await axios.get<IncidentDTO[]>(BASE);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw toError(error);
    }
};

export const fetchIncident = async (id: string): Promise<IncidentDTO> => {
    try {
        const { data } = await axios.get<IncidentDTO>(`${BASE}/${encodeURIComponent(id)}`);
        return data;
    } catch (error) {
        throw toError(error);
    }
};

export const createIncident = async (dto: IncidentPayload): Promise<IncidentDTO> => {
    try {
        const { data } = await axios.post<IncidentDTO>(BASE, dto);
        return data;
    } catch (error) {
        throw toError(error);
    }
};

export const updateIncident = async (id: string, dto: IncidentPayload): Promise<IncidentDTO> => {
    try {
        const { data } = await axios.put<IncidentDTO>(`${BASE}/${encodeURIComponent(id)}`, dto);
        return data;
    } catch (error) {
        throw toError(error);
    }
};

export const deleteIncident = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${BASE}/${encodeURIComponent(id)}`);
    } catch (error) {
        throw toError(error);
    }
};
