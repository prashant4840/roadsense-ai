import { renderHook } from '@testing-library/react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { AccidentData } from '@/types';

describe('useFormValidation Hook', () => {
  const { result } = renderHook(() => useFormValidation());

  it('validates valid form data', () => {
    const validData: AccidentData = {
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

    const errors = result.current.validateForm(validData);

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('rejects invalid hour', () => {
    const invalidData: AccidentData = {
      hour: 25,
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

    const errors = result.current.validateForm(invalidData);

    expect(errors.hour).toBeDefined();
  });

  it('rejects invalid temperature', () => {
    const invalidData: AccidentData = {
      hour: 14,
      is_weekend: 0,
      temperature: 100,
      vehicles_involved: 2,
      casualties: 1,
      is_peak_hour: 0,
      is_night: 0,
      road_type: 'highway',
      weather: 'clear',
      traffic_density: 'high',
      visibility: 'high',
    };

    const errors = result.current.validateForm(invalidData);

    expect(errors.temperature).toBeDefined();
  });

  it('rejects zero vehicles', () => {
    const invalidData: AccidentData = {
      hour: 14,
      is_weekend: 0,
      temperature: 25,
      vehicles_involved: 0,
      casualties: 1,
      is_peak_hour: 0,
      is_night: 0,
      road_type: 'highway',
      weather: 'clear',
      traffic_density: 'high',
      visibility: 'high',
    };

    const errors = result.current.validateForm(invalidData);

    expect(errors.vehicles_involved).toBeDefined();
  });

  it('rejects negative casualties', () => {
    const invalidData: AccidentData = {
      hour: 14,
      is_weekend: 0,
      temperature: 25,
      vehicles_involved: 2,
      casualties: -1,
      is_peak_hour: 0,
      is_night: 0,
      road_type: 'highway',
      weather: 'clear',
      traffic_density: 'high',
      visibility: 'high',
    };

    const errors = result.current.validateForm(invalidData);

    expect(errors.casualties).toBeDefined();
  });
});
