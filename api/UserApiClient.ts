import {APIRequestContext, APIResponse} from '@playwright/test';
import {User} from './user.model';

export class UserApiClient {
  readonly baseUrl: string = 'user';

  constructor(private request: APIRequestContext) {
  }

  async create(user: User): Promise<APIResponse> {
    return await this.request.post(this.baseUrl, {data: user});
  }

  async createWithList(users: User[]): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/createWithList`, {data: users});
  }

  async update(username: string, user: User): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}/${username}`, {data: user});
  }

  async delete(username: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/${username}`);
  }

  async get(username: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/${username}`);
  }

  async login(username: string, password: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/login`, {
      params: {username, password}
    });
  }

  async logout(): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/logout`);
  }
}
