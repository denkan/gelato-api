import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Gelato as I } from './types';

export class GelatoApiBase {
  protected config: I.Config;
  protected axios: AxiosInstance;

  static readonly baseUrl?: string;

  constructor(config: I.Config, baseUrl?: string) {
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
        throw err; // TODO: something else?
      });
  }
}
