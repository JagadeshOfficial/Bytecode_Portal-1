"use client";

type JsonFetchResult<T> = {
    ok: boolean;
    status: number;
    data: T | null;
    error: string | null;
};

function extractErrorMessage(payload: unknown) {
    if (!payload || typeof payload !== 'object') return null;

    const candidate = payload as Record<string, unknown>;
    const message = candidate.error || candidate.message;

    return typeof message === 'string' && message.trim() ? message.trim() : null;
}

export async function fetchJsonSafe<T>(input: RequestInfo | URL, init?: RequestInit): Promise<JsonFetchResult<T>> {
    try {
        const response = await fetch(input, init);
        const text = await response.text();

        if (!text) {
            return {
                ok: response.ok,
                status: response.status,
                data: null,
                error: response.ok ? null : `Request failed with status ${response.status}`,
            };
        }

        try {
            const data = JSON.parse(text) as T;
            return {
                ok: response.ok,
                status: response.status,
                data,
                error: response.ok ? null : extractErrorMessage(data) || `Request failed with status ${response.status}`,
            };
        } catch {
            return {
                ok: false,
                status: response.status,
                data: null,
                error: text.trim() || `Request failed with status ${response.status}`,
            };
        }
    } catch (error) {
        return {
            ok: false,
            status: 0,
            data: null,
            error: error instanceof Error ? error.message : 'Network unavailable',
        };
    }
}
