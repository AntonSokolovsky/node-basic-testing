import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let mockAxios: Partial<AxiosInstance>;

  beforeEach(() => {
    mockAxios = { get: jest.fn() };
    (axios.create as jest.Mock).mockReturnValue(mockAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base URL', async () => {
    const url = '/posts/1';
    const expectedResponse = { id: 1, title: 'My Post' };
    mockAxios.get = jest.fn().mockResolvedValueOnce({ data: expectedResponse });
    await throttledGetDataFromApi(url);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct URL', async () => {
    const url = '/posts/1';
    const expectedResponse = { id: 1, title: 'My Post' };
    mockAxios.get = jest.fn().mockResolvedValueOnce({ data: expectedResponse });
    await throttledGetDataFromApi(url);

    expect(mockAxios.get).toHaveBeenCalledWith(url);
  });

  test('should return response data', async () => {
    const url = '/posts/1';
    const expectedResponse = { id: 1, title: 'My Post' };

    mockAxios.get = jest.fn().mockResolvedValueOnce({ data: expectedResponse });
    const result = await throttledGetDataFromApi(url);
    expect(result).toEqual(expectedResponse);
  });
});
