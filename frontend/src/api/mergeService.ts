// src/services/mergeService.ts

export type FieldResolution = Record<string, string>;
export type MergeRequest = {
    sourceIds?: string[];
    fieldResolution?: FieldResolution;
};

export async function mergeParticipant(
    baseUrl: string,         // np. "http://localhost:8080"
    targetId: string,
    body: MergeRequest,
    options?: { signal?: AbortSignal }
): Promise<Record<string, any>> {
    const url = `${baseUrl.replace(/\/$/, '')}/api/participants/${encodeURIComponent(targetId)}/merge`;
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
