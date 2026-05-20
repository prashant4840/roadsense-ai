import { renderHook, act, waitFor } from '@testing-library/react';
import { useFormState } from '@/hooks/useFormState';
import { AccidentData } from '@/types';

const initialValues: AccidentData = {
  hour: 12,
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

describe('useFormState Hook', () => {
  it('initializes with correct values', () => {
    const { result } = renderHook(() => useFormState(initialValues));

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.touched).toEqual({});
    expect(result.current.errors).toEqual({});
  });

  it('handles change events', () => {
    const { result } = renderHook(() => useFormState(initialValues));

    act(() => {
      result.current.handleChange({
        target: { name: 'hour', value: '18', type: 'number' },
      } as any);
    });

    expect(result.current.formData.hour).toBe(18);
  });

  it('handles blur events', () => {
    const { result } = renderHook(() => useFormState(initialValues));

    act(() => {
      result.current.handleBlur({
        target: { name: 'hour' },
      } as any);
    });

    expect(result.current.touched.hour).toBe(true);
  });

  it('resets form to initial values', () => {
    const { result } = renderHook(() => useFormState(initialValues));

    act(() => {
      result.current.handleChange({
        target: { name: 'hour', value: '20', type: 'number' },
      } as any);
    });

    expect(result.current.formData.hour).toBe(20);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.hour).toBe(initialValues.hour);
  });

  it('clears errors when user starts typing', () => {
    const { result } = renderHook(() => useFormState(initialValues));

    act(() => {
      result.current.setErrors({ hour: 'Invalid hour' });
    });

    expect(result.current.errors.hour).toBe('Invalid hour');

    act(() => {
      result.current.handleChange({
        target: { name: 'hour', value: '15', type: 'number' },
      } as any);
    });

    expect(result.current.errors.hour).toBeUndefined();
  });
});
