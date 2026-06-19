import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PredictionForm } from '@/components/PredictionForm';
import { useApp } from '@/context/AppContext';
import * as formStateModule from '@/hooks/useFormState';
import * as formValidationModule from '@/hooks/useFormValidation';

jest.mock('@/context/AppContext');
jest.mock('@/hooks/useFormState');
jest.mock('@/hooks/useFormValidation');

describe('PredictionForm Component', () => {
  const mockOnPredict = jest.fn();
  const defaultFormData = {
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

  beforeEach(() => {
    jest.clearAllMocks();

    (formStateModule.useFormState as jest.Mock).mockReturnValue({
      formData: defaultFormData,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      errors: {},
      setErrors: jest.fn(),
      resetForm: jest.fn(),
    });

    (formValidationModule.useFormValidation as jest.Mock).mockReturnValue({
      validateForm: jest.fn().mockReturnValue({}),
    });

    (useApp as jest.Mock).mockReturnValue({
      prediction: {
        predict: jest.fn().mockResolvedValue({ risk_level: 0.5, confidence: 0.9 }),
        loading: false,
        error: null,
        result: null,
      }
    });
  });

  it('renders form with all sections', () => {
    render(<PredictionForm onPredict={mockOnPredict} />);

    expect(screen.getByText('⏰ Time & Date')).toBeInTheDocument();
    expect(screen.getByText('🌦️ Weather')).toBeInTheDocument();
    expect(screen.getByText('👁️ Visibility')).toBeInTheDocument();
    expect(screen.getByText('🛣️ Road & Traffic')).toBeInTheDocument();
    expect(screen.getByText('🚗 Accident Details')).toBeInTheDocument();
    expect(screen.getByText('📋 Additional Info')).toBeInTheDocument();
  });

  it('renders submit and reset buttons', () => {
    render(<PredictionForm onPredict={mockOnPredict} />);

    expect(screen.getByText('🔮 Predict Accident Risk')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('displays validation errors', () => {
    const mockError = { hour: 'Hour must be between 0 and 23' };
    (formStateModule.useFormState as jest.Mock).mockReturnValue({
      formData: defaultFormData,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      errors: mockError,
      setErrors: jest.fn(),
      resetForm: jest.fn(),
    });

    render(<PredictionForm onPredict={mockOnPredict} />);

    expect(screen.getByText('Hour must be between 0 and 23')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockPredict = jest.fn().mockResolvedValue({ risk_level: 0.6, confidence: 0.88 });
    (useApp as jest.Mock).mockReturnValue({
      prediction: {
        predict: mockPredict,
        loading: false,
        error: null,
        result: null,
      }
    });

    const { rerender } = render(<PredictionForm onPredict={mockOnPredict} />);

    const submitButton = screen.getByText('🔮 Predict Accident Risk');
    fireEvent.click(submitButton);

    expect(mockPredict).toHaveBeenCalledWith(defaultFormData);
  });

  it('displays loading state during prediction', () => {
    (useApp as jest.Mock).mockReturnValue({
      prediction: {
        predict: jest.fn(),
        loading: true,
        error: null,
        result: null,
      }
    });

    render(<PredictionForm onPredict={mockOnPredict} />);

    const submitButton = screen.getByRole('button', { name: /⏳ Predicting/i });
    expect(submitButton).toBeDisabled();
  });

  it('displays API error message', () => {
    const mockError = 'Network error. Please check your connection.';
    (useApp as jest.Mock).mockReturnValue({
      prediction: {
        predict: jest.fn(),
        loading: false,
        error: mockError,
        result: null,
      }
    });

    render(<PredictionForm onPredict={mockOnPredict} />);

    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('calls resetForm when reset button is clicked', () => {
    const mockResetForm = jest.fn();
    (formStateModule.useFormState as jest.Mock).mockReturnValue({
      formData: defaultFormData,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      errors: {},
      setErrors: jest.fn(),
      resetForm: mockResetForm,
    });

    render(<PredictionForm onPredict={mockOnPredict} />);

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockResetForm).toHaveBeenCalled();
  });

  it('displays validation errors before submission', async () => {
    const validationErrors = { hour: 'Invalid hour' };
    const mockValidateForm = jest.fn().mockReturnValue(validationErrors);
    const mockSetErrors = jest.fn();

    (formValidationModule.useFormValidation as jest.Mock).mockReturnValue({
      validateForm: mockValidateForm,
    });

    (formStateModule.useFormState as jest.Mock).mockReturnValue({
      formData: defaultFormData,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      errors: {},
      setErrors: mockSetErrors,
      resetForm: jest.fn(),
    });

    render(<PredictionForm onPredict={mockOnPredict} />);

    const submitButton = screen.getByText('🔮 Predict Accident Risk');
    fireEvent.click(submitButton);

    expect(mockSetErrors).toHaveBeenCalledWith(validationErrors);
  });
});
