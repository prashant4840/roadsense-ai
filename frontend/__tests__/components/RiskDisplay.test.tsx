import { render, screen } from '@testing-library/react';
import { RiskDisplay } from '@/components/RiskDisplay';
import { PredictionResponse } from '@/types';

describe('RiskDisplay Component', () => {
  const mockHighRiskResult: PredictionResponse = {
    prediction: 'HIGH RISK',
    risk_level: 1,
    confidence: 0.85,
    timestamp: new Date().toISOString(),
  };

  const mockLowRiskResult: PredictionResponse = {
    prediction: 'LOW RISK',
    risk_level: 0,
    confidence: 0.72,
    timestamp: new Date().toISOString(),
  };

  it('displays HIGH RISK warning', () => {
    render(<RiskDisplay {...mockHighRiskResult} />);

    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('displays LOW RISK success', () => {
    render(<RiskDisplay {...mockLowRiskResult} />);

    expect(screen.getByText('LOW RISK')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('shows correct confidence percentage', () => {
    render(<RiskDisplay {...mockHighRiskResult} />);

    expect(screen.getByText('85.0%')).toBeInTheDocument();
  });

  it('shows safe recommendation for low risk', () => {
    render(<RiskDisplay {...mockLowRiskResult} />);

    expect(screen.getByText('✅ Safe conditions')).toBeInTheDocument();
  });

  it('shows caution recommendation for high risk', () => {
    render(<RiskDisplay {...mockHighRiskResult} />);

    expect(screen.getByText('⚠️ Take precautions')).toBeInTheDocument();
  });

  it('displays correct risk level label', () => {
    const { rerender } = render(<RiskDisplay {...mockHighRiskResult} />);

    expect(screen.getByText('Level 1')).toBeInTheDocument();

    rerender(<RiskDisplay {...mockLowRiskResult} />);

    expect(screen.getByText('Level 0')).toBeInTheDocument();
  });
});
