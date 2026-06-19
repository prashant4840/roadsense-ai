import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';

jest.mock('@/context/AppContext');

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title', () => {
    (useApp as jest.Mock).mockReturnValue({
      health: { isHealthy: true, loading: false }
    });

    render(<Header />);

    expect(screen.getByText('🛣️ RoadSense AI')).toBeInTheDocument();
    expect(screen.getByText('Accident Risk Prediction System')).toBeInTheDocument();
  });

  it('shows loading state while checking health', () => {
    (useApp as jest.Mock).mockReturnValue({
      health: { isHealthy: false, loading: true }
    });

    render(<Header />);

    expect(screen.getByText('Checking...')).toBeInTheDocument();
  });

  it('shows healthy status when API is online', () => {
    (useApp as jest.Mock).mockReturnValue({
      health: { isHealthy: true, loading: false }
    });

    render(<Header />);

    expect(screen.getByText('✅ API Online')).toBeInTheDocument();
  });

  it('shows offline status when API is down', () => {
    (useApp as jest.Mock).mockReturnValue({
      health: { isHealthy: false, loading: false }
    });

    render(<Header />);

    expect(screen.getByText('❌ API Offline')).toBeInTheDocument();
  });
});
