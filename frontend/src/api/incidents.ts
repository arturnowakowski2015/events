import axios from 'axios';
import type { IncidentDTO } from './types';

const BASE = 'http://localhost:8080/api/incidents';

export const fetchIncidents = async (): Promise<IncidentDTO[]> => {
    try {
        const { data } = await axios.get<IncidentDTO[]>(BASE);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching incidents:', error);
        return [];
    }
};

export const fetchIncident = async (id: string): Promise<IncidentDTO> => {
    const { data } = await axios.get<IncidentDTO>(`${BASE}/${id}`);
    return data;
};

export const createIncident = async (dto: Omit<IncidentDTO, 'incidentId'>): Promise<IncidentDTO> => {
    try {
        const { data, status } = await axios.post<IncidentDTO>(BASE, dto);
        if (status === 201) {
            console.info('REST 201 Created: incident created successfully.');
        }
        return data;
    } catch (error) {
        console.error('Error creating incident:', error);
        throw error;
    }
};
