import { render, screen } from '@testing-library/react';
import { MapViewer } from '@/components/MapViewer';
import * as constants from '@/lib/constants';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: any) => {
    const module = fn();
    return module.then ? module : module.default;
  },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, center, zoom, style }: any) => (
    <div data-testid="map-container" data-center={center} data-zoom={zoom}>
      {children}
    </div>
  ),
  TileLayer: ({ url, attribution }: any) => (
    <div data-testid="tile-layer" data-url={url}>
      {attribution}
    </div>
  ),
  CircleMarker: ({ center, radius, color, children }: any) => (
    <div data-testid="circle-marker" data-radius={radius} data-color={color}>
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
}));

describe('MapViewer Component', () => {
  it('renders map container', () => {
    render(<MapViewer />);

    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('renders with correct center coordinates', () => {
    render(<MapViewer />);

    const mapContainer = screen.getByTestId('map-container');
    const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');

    expect(center[0]).toBe(constants.INDIA_CENTER[0]);
    expect(center[1]).toBe(constants.INDIA_CENTER[1]);
  });

  it('renders tile layer', () => {
    render(<MapViewer />);

    const tileLayer = screen.getByTestId('tile-layer');
    expect(tileLayer).toBeInTheDocument();
    expect(tileLayer.getAttribute('data-url')).toContain('openstreetmap');
  });

  it('renders circle markers for each hotspot', () => {
    render(<MapViewer />);

    const circleMarkers = screen.getAllByTestId('circle-marker');
    expect(circleMarkers).toHaveLength(constants.ACCIDENT_HOTSPOTS.length);
  });

  it('uses red color for high risk hotspots', () => {
    render(<MapViewer />);

    const circleMarkers = screen.getAllByTestId('circle-marker');
    const highRiskMarker = circleMarkers.find(marker => {
      const dataColor = marker.getAttribute('data-color');
      return dataColor === '#dc2626';
    });

    expect(highRiskMarker).toBeDefined();
  });

  it('uses orange color for medium risk hotspots', () => {
    render(<MapViewer />);

    const circleMarkers = screen.getAllByTestId('circle-marker');
    const mediumRiskMarker = circleMarkers.find(marker => {
      const dataColor = marker.getAttribute('data-color');
      return dataColor === '#f97316';
    });

    expect(mediumRiskMarker).toBeDefined();
  });

  it('renders popup with hotspot information', () => {
    render(<MapViewer />);

    const popups = screen.getAllByTestId('popup');
    expect(popups.length).toBeGreaterThan(0);
  });
});
