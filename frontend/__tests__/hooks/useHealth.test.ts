import { renderHook, waitFor } from '@testing-library/react';
import { useHealth } from '@/hooks/useHealth';
import * as apiModule from '@/utils/api';

jest.mock('@/utils/api');

describe('useHealth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with loading state', () => {
    (apiModule.checkHealth as jest.Mock).mockResolvedValue({
      status: 'healthy',
      model_loaded: true,
      model_features: 19,
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useHealth());

    expect(result.current.loading).toBe(true);
  });

  it('sets healthy status on successful health check', async () => {
    const mockHealth = {
      status: 'healthy',
      model_loaded: true,
      model_features: 19,
      timestamp: new Date().toISOString(),
    };
    (apiModule.checkHealth as jest.Mock).mockResolvedValue(mockHealth);

    const { result } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isHealthy).toBe(true);
    expect(result.current.status).toEqual(mockHealth);
  });

  it('sets unhealthy status on failed health check', async () => {
    (apiModule.checkHealth as jest.Mock).mockRejectedValue(new Error('Connection failed'));

    const { result } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isHealthy).toBe(false);
    expect(result.current.status).toBeNull();
  });

  it('handles offline API response', async () => {
    const mockOfflineHealth = {
      status: 'offline',
      model_loaded: false,
      model_features: 0,
      timestamp: new Date().toISOString(),
    };
    (apiModule.checkHealth as jest.Mock).mockResolvedValue(mockOfflineHealth);

    const { result } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isHealthy).toBe(false);
  });

  it('sets up interval for periodic health checks', async () => {
    (apiModule.checkHealth as jest.Mock).mockResolvedValue({
      status: 'healthy',
      model_loaded: true,
      model_features: 19,
      timestamp: new Date().toISOString(),
    });

    const { result, unmount } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiModule.checkHealth).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(30000);

    expect(apiModule.checkHealth).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('cleans up interval on unmount', async () => {
    (apiModule.checkHealth as jest.Mock).mockResolvedValue({
      status: 'healthy',
      model_loaded: true,
      model_features: 19,
      timestamp: new Date().toISOString(),
    });

    const { unmount } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(apiModule.checkHealth).toHaveBeenCalledTimes(1);
    });

    unmount();

    jest.advanceTimersByTime(30000);

    expect(apiModule.checkHealth).toHaveBeenCalledTimes(1);
  });
});
