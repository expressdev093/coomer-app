import axios, {AxiosInstance} from 'axios';

export class CoomerApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'https://coomer.su/api/v1') {
    this.client = axios.create({baseURL});
  }

  public async get<T = any>(
    url: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.client.get<T>(url, {params});
    return response.data;
  }

  // You can add POST, PUT, DELETE if needed later
}
