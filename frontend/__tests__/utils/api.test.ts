import { predictRisk, checkHealth, retryRequest, createDebouncedRequest, apiClient } from '@/utils/api';
import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

jest.mock('axios');
jest.mock('@sentry/nextjs');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make successful prediction request', async () => {
    const mockData = {
      hour: 14,
      is_weekend: 0,
      temperature: 25,
      vehicles_involved: 2,
      casualties: 1,
      is_peak_hour: 0,
      is_night: 0,
      road_type: 'highway',
      weather: 'clear',
      traffic_density: 'high',
      visibility: 'high',
    };

    const mockResponse = { risk_level: 0.45, confidence: 0.92 };
    mockedAxios.create.mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: mockResponse }),
      get: jest.fn(),
      interceptors: { response: { use: jest.fn() } },
      defaults: { baseURL: '' },
    } as any);

    const result = await predictRisk(mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors with user-friendly messages', async () => {
    const mockError = {
      response: { status: 400, data: { detail: 'Invalid input' } },
      message: 'Bad Request',
    };

    mockedAxios.create.mockReturnValue({
      post: jest.fn().mockRejectedValue(mockError),
      interceptors: { response: { use: jest.fn((success, error) => error(mockError)) } },
      defaults: { baseURL: '' },
    } as any);

    await expect(predictRisk({} as any)).rejects.toThrow('Invalid input');
  });

  it('should check health and return status', async () => {
    const mockHealth = { status: 'healthy', model_loaded: true, model_features: 19, timestamp: new Date().toISOString() };

    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockHealth }),
      post: jest.fn(),
      interceptors: { response: { use: jest.fn() } },
      defaults: { baseURL: '' },
    } as any);

    const result = await checkHealth();
    expect(result).toEqual(mockHealth);
  });

  it('should return offline status when health check fails', async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
      post: jest.fn(),
      interceptors: { response: { use: jest.fn() } },
      defaults: { baseURL: '' },
    } as any);

    const result = await checkHealth();
    expect(result.status).toBe('offline');
    expect(result.model_loaded).toBe(false);
  });

  it('should retry failed requests up to max retries', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce('Success');

    const result = await retryRequest(mockFn, 3, 10);
    expect(result).toBe('Success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should throw error after max retries exceeded', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'));

    await expect(retryRequest(mockFn, 2, 10)).rejects.toThrow('Always fails');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should debounce requests', async () => {
    const mockFn = jest.fn().mockResolvedValue('result');
    const debouncedFn = createDebouncedRequest(mockFn, 50);

    debouncedFn('arg1');
    debouncedFn('arg2');
    debouncedFn('arg3');

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg3');
  });
});
