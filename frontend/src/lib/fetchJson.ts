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
        
        // Handle no-content responses or cases where fetch succeeds but response body is missing/bad
        const text = await response.text().catch(() => '');

        if (!text || !text.trim()) {
            return {
                ok: response.ok,
                status: response.status,
                data: null,
                error: response.ok ? null : `Request failed with status ${response.status}`,
            };
        }

        // Check if response is likely JSON before parsing to avoid "Unexpected token" errors
        const isJson = response.headers.get('content-type')?.includes('application/json') || 
                       (text.startsWith('{') && text.endsWith('}')) || 
                       (text.startsWith('[') && text.endsWith(']'));

        if (!isJson) {
            return {
                ok: false,
                status: response.status,
                data: null,
                error: text.length > 100 ? `Unexpected response format (${response.status})` : text.trim(),
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
        } catch (parseError) {
            return {
                ok: false,
                status: response.status,
                data: null,
                error: `JSON Parse Error: ${parseError instanceof Error ? parseError.message : 'Unknown reason'}`,
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
