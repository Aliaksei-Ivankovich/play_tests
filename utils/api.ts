import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Утилиты для работы с API в тестах
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;
  private token?: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = process.env.API_URL || process.env.BASE_URL || 'https://example.com';
  }

  /**
   * Установить токен авторизации
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Получить заголовки по умолчанию
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * GET запрос
   */
  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * POST запрос
   */
  async post(endpoint: string, data: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      data,
    });
  }

  /**
   * PUT запрос
   */
  async put(endpoint: string, data: Record<string, unknown>): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      data,
    });
  }

  /**
   * DELETE запрос
   */
  async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }
}
