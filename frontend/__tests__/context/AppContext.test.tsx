import { render, screen, renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '@/context/AppContext';
import * as predictionModule from '@/hooks/usePrediction';
import * as healthModule from '@/hooks/useHealth';

jest.mock('@/hooks/usePrediction');
jest.mock('@/hooks/useHealth');

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (predictionModule.usePrediction as jest.Mock).mockReturnValue({
      predict: jest.fn(),
      loading: false,
      error: null,
      result: null,
    });

    (healthModule.useHealth as jest.Mock).mockReturnValue({
      isHealthy: true,
      status: null,
      loading: false,
    });
  });

  describe('AppProvider', () => {
    it('provides context to children', () => {
      const TestComponent = () => {
        const { prediction, health } = useApp();
        return (
          <div>
            <div>{health.isHealthy ? 'Healthy' : 'Unhealthy'}</div>
            <div>{prediction.loading ? 'Loading' : 'Ready'}</div>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });

    it('includes prediction state in context', () => {
      const mockPredict = jest.fn().mockResolvedValue({ risk_level: 0.5, confidence: 0.9 });
      (predictionModule.usePrediction as jest.Mock).mockReturnValue({
        predict: mockPredict,
        loading: false,
        error: null,
        result: { risk_level: 0.5, confidence: 0.9 },
      });

      const TestComponent = () => {
        const { prediction } = useApp();
        return <div>{prediction.result?.risk_level}</div>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByText('0.5')).toBeInTheDocument();
    });

    it('includes health state in context', () => {
      (healthModule.useHealth as jest.Mock).mockReturnValue({
        isHealthy: false,
        status: { status: 'offline', model_loaded: false, model_features: 0, timestamp: new Date().toISOString() },
        loading: false,
      });

      const TestComponent = () => {
        const { health } = useApp();
        return <div>{health.isHealthy ? 'Healthy' : 'Unhealthy'}</div>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByText('Unhealthy')).toBeInTheDocument();
    });
  });

  describe('useApp Hook', () => {
    it('throws error when used outside provider', () => {
      const TestComponent = () => {
        useApp();
        return <div>Test</div>;
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useApp must be used within AppProvider');

      consoleErrorSpy.mockRestore();
    });

    it('returns context values', () => {
      const mockPredict = jest.fn();
      (predictionModule.usePrediction as jest.Mock).mockReturnValue({
        predict: mockPredict,
        loading: true,
        error: 'Test error',
        result: null,
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      expect(result.current.prediction.loading).toBe(true);
      expect(result.current.prediction.error).toBe('Test error');
      expect(result.current.prediction.predict).toBe(mockPredict);
    });

    it('updates context when prediction state changes', () => {
      const mockPredict = jest.fn().mockResolvedValue({ risk_level: 0.7, confidence: 0.88 });
      const { result, rerender } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      expect(result.current.prediction.loading).toBe(false);

      (predictionModule.usePrediction as jest.Mock).mockReturnValue({
        predict: mockPredict,
        loading: true,
        error: null,
        result: null,
      });

      rerender();

      expect(result.current.prediction.loading).toBe(true);
    });
  });
});
