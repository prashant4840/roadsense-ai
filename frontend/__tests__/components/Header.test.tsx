import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { useHealth } from '@/hooks/useHealth';

jest.mock('@/hooks/useHealth');

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title', () => {
    (useHealth as jest.Mock).mockReturnValue({ isHealthy: true, loading: false });

    render(<Header />);

    expect(screen.getByText('🛣️ RoadSense AI')).toBeInTheDocument();
    expect(screen.getByText('Accident Risk Prediction System')).toBeInTheDocument();
  });

  it('shows loading state while checking health', () => {
    (useHealth as jest.Mock).mockReturnValue({ isHealthy: false, loading: true });

    render(<Header />);

    expect(screen.getByText('Checking...')).toBeInTheDocument();
  });

  it('shows healthy status when API is online', () => {
    (useHealth as jest.Mock).mockReturnValue({ isHealthy: true, loading: false });

    render(<Header />);

    expect(screen.getByText('✅ API Online')).toBeInTheDocument();
  });

  it('shows offline status when API is down', () => {
    (useHealth as jest.Mock).mockReturnValue({ isHealthy: false, loading: false });

    render(<Header />);

    expect(screen.getByText('❌ API Offline')).toBeInTheDocument();
  });
});
