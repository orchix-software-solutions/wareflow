import axios, { AxiosError, type AxiosInstance } from "axios";
import { useAuthStore } from "@/store/use-auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  code: string;
  errors: unknown[];
}

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.statusCode = response.statusCode;
    this.code = response.code;
  }
}

function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<ApiErrorResponse> | undefined;
    return new ApiError({
      success: false,
      statusCode: data?.statusCode ?? error.response?.status ?? 500,
      message: data?.message ?? error.message ?? "Something went wrong",
      code: data?.code ?? "UNKNOWN_ERROR",
      errors: data?.errors ?? [],
    });
  }
  return new ApiError({
    success: false,
    statusCode: 500,
    message: error instanceof Error ? error.message : "Something went wrong",
    code: "UNKNOWN_ERROR",
    errors: [],
  });
}

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const body = payload as { data: unknown; meta?: unknown };
    if (body.meta) {
      return { data: body.data, meta: body.meta } as T;
    }
    return body.data as T;
  }
  return payload as T;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    this.instance.interceptors.request.use((config) => {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.instance.get(endpoint);
      return unwrap<T>(response.data);
    } catch (error) {
      throw toApiError(error);
    }
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    try {
      const response = await this.instance.post(endpoint, body);
      return unwrap<T>(response.data);
    } catch (error) {
      throw toApiError(error);
    }
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    try {
      const response = await this.instance.patch(endpoint, body);
      return unwrap<T>(response.data);
    } catch (error) {
      throw toApiError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.instance.delete(endpoint);
      return unwrap<T>(response.data);
    } catch (error) {
      throw toApiError(error);
    }
  }
}

export const apiClient = new ApiClient();
