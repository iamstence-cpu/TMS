import { clsx } from 'clsx';

export const cn = (...c: Array<string | undefined | false>) => clsx(c);

export const safeJsonParse = <T>(value: string, fallback: T): T => {
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });
export const err = (error: string): ApiResponse<never> => ({ success: false, error });
