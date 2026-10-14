import {APIRequestContext, APIResponse} from '@playwright/test';
import {Pet} from './pet.model';

export class PetApiClient {
  readonly baseUrl: string = 'pet';

  constructor(private request: APIRequestContext) {
  }

  async create(pet: Pet): Promise<APIResponse> {
    return await this.request.post(this.baseUrl, {data: pet});
  }

  async update(pet: Pet): Promise<APIResponse> {
    return await this.request.put(this.baseUrl, {data: pet});
  }

  async delete(id: number | string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/${id}`);
  }

  async getById(id: number | string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/${id}`);
  }

  async getPetsByStatus(status: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/findByStatus`, {
      params: {status}
    });
  }
}
