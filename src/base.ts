import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export class GelatoApiBase {
  protected config: GelatoApiConfig;
  protected axios: AxiosInstance;

  static readonly baseUrl?: string;

  constructor(config: GelatoApiConfig, baseUrl?: string) {
    this.config = { ...config };
    this.axios = axios.create({
      baseURL: baseUrl ?? (this.constructor as typeof GelatoApiBase).baseUrl,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.apiKey,
      },
    });
  }

  protected async handleResponse<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
    return p
      .then((r) => r.data)
      .catch((err) => {
        throw new GelatoApiError(err);
      });
  }
}

export class GelatoApiError extends Error {
  constructor(public axiosError: AxiosError) {
    super(axiosError.message);
    console.log('GELATO ERROR...', this);
  }
}

export interface GelatoApiConfig {
  apiKey: string;
}

export interface GelatoApiListResponse<T> {
  data: T[];
  pagination: { total: number; offset: number };
}
export interface GelatoApiListRequest<T> {
  data: T[];
  pagination: { total: number; offset: number };
}
