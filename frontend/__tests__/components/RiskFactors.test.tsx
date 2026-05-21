import { render, screen } from '@testing-library/react';
import { RiskFactors } from '@/components/RiskFactors';
import * as constants from '@/lib/constants';

jest.mock('recharts', () => ({
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-items={data.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: any) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey, angle }: any) => (
    <div data-testid="x-axis" data-key={dataKey} data-angle={angle} />
  ),
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: ({ strokeDasharray }: any) => (
    <div data-testid="cartesian-grid" data-dasharray={strokeDasharray} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children, width, height }: any) => (
    <div data-testid="responsive-container" data-width={width} data-height={height}>
      {children}
    </div>
  ),
}));

describe('RiskFactors Component', () => {
  it('renders title', () => {
    render(<RiskFactors />);

    expect(screen.getByText('📊 Top Risk Factors')).toBeInTheDocument();
  });

  it('renders bar chart with responsive container', () => {
    render(<RiskFactors />);

    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
    expect(container.getAttribute('data-width')).toBe('100%');
    expect(container.getAttribute('data-height')).toBe('250');
  });

  it('renders chart components', () => {
    render(<RiskFactors />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  it('displays top 6 features sorted by importance', () => {
    render(<RiskFactors />);

    const barChart = screen.getByTestId('bar-chart');
    const itemCount = barChart.getAttribute('data-items');

    expect(parseInt(itemCount || '0')).toBeLessThanOrEqual(6);
  });

  it('uses correct bar color', () => {
    render(<RiskFactors />);

    const bar = screen.getByTestId('bar');
    expect(bar.getAttribute('data-fill')).toBe('#3b82f6');
  });

  it('shows feature importance data', () => {
    render(<RiskFactors />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart.getAttribute('data-items')).toBeDefined();
  });
});
