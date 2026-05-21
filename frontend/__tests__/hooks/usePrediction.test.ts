import { renderHook, act, waitFor } from '@testing-library/react';
import { usePrediction } from '@/hooks/usePrediction';
import * as apiModule from '@/utils/api';

jest.mock('@/utils/api');

describe('usePrediction Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    (apiModule.predictRisk as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => usePrediction());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('makes prediction and returns result', async () => {
    const mockResponse = { risk_level: 0.7, confidence: 0.85 };
    (apiModule.predictRisk as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePrediction());

    await act(async () => {
      const response = await result.current.predict({
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
      });

      expect(response).toEqual(mockResponse);
    });

    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('handles prediction errors', async () => {
    const mockError = new Error('API Error');
    (apiModule.predictRisk as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePrediction());

    await act(async () => {
      const response = await result.current.predict({} as any);
      expect(response).toBeNull();
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.result).toBeNull();
  });

  it('sets loading state during prediction', async () => {
    const mockResponse = { risk_level: 0.5, confidence: 0.9 };
    (apiModule.predictRisk as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 50))
    );

    const { result } = renderHook(() => usePrediction());

    const prediction = act(async () => {
      return result.current.predict({} as any);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('clears previous error on new prediction', async () => {
    (apiModule.predictRisk as jest.Mock)
      .mockRejectedValueOnce(new Error('First Error'))
      .mockResolvedValueOnce({ risk_level: 0.3, confidence: 0.8 });

    const { result } = renderHook(() => usePrediction());

    await act(async () => {
      await result.current.predict({} as any);
    });

    expect(result.current.error).toBe('First Error');

    await act(async () => {
      await result.current.predict({} as any);
    });

    expect(result.current.error).toBeNull();
  });
});
