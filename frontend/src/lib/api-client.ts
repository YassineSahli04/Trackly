import { supabase } from '@/lib/supabase';

type ApiErrorBody = {
  detail?: string;
  message?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

  if (!apiUrl) {
    throw new ApiError('The backend URL is not configured.', 0);
  }

  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (error || !accessToken) {
    throw new ApiError('Your session has expired. Please sign in again.', 401);
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError('Unable to reach the backend. Please try again.', 0);
  }

  const body = await parseResponse(response);

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;
    throw new ApiError(
      errorBody?.message ?? errorBody?.detail ?? 'Something went wrong. Please try again.',
      response.status,
    );
  }

  return body as T;
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError('The backend returned an invalid response.', response.status);
  }
}

export function getApiErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}
