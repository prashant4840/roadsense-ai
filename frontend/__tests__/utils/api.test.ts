import { retryRequest, createDebouncedRequest } from '@/utils/api';

describe('API Utilities', () => {
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
