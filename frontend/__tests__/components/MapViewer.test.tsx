import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapViewer } from '@/components/MapViewer';
import * as constants from '@/lib/constants';

// Mock react-leaflet before dynamic import resolution
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, center, zoom }: any) => (
    <div data-testid="map-container" data-center={JSON.stringify(center)} data-zoom={zoom}>
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

// Mock next/dynamic to render components synchronously in tests
jest.mock('next/dynamic', () => {
  return function dynamic(importFn: () => Promise<any>, _options?: any) {
    // Return a component that synchronously renders the mock
    const MockComponent = (props: any) => {
      const [Comp, setComp] = React.useState<any>(null);
      React.useEffect(() => {
        importFn().then((mod: any) => {
          setComp(() => mod.default || mod);
        });
      }, []);
      return Comp ? React.createElement(Comp, props) : null;
    };
    MockComponent.displayName = 'DynamicComponent';
    return MockComponent;
  };
});

describe('MapViewer Component', () => {
  it('renders map container', async () => {
    render(<MapViewer />);

    const mapContainer = await screen.findByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('renders with correct center coordinates', async () => {
    render(<MapViewer />);

    const mapContainer = await screen.findByTestId('map-container');
    const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');

    expect(center[0]).toBe(constants.INDIA_CENTER[0]);
    expect(center[1]).toBe(constants.INDIA_CENTER[1]);
  });

  it('renders tile layer', async () => {
    render(<MapViewer />);

    const tileLayer = await screen.findByTestId('tile-layer');
    expect(tileLayer).toBeInTheDocument();
    expect(tileLayer.getAttribute('data-url')).toContain('openstreetmap');
  });

  it('renders circle markers for each hotspot', async () => {
    render(<MapViewer />);

    const circleMarkers = await screen.findAllByTestId('circle-marker');
    expect(circleMarkers).toHaveLength(constants.ACCIDENT_HOTSPOTS.length);
  });

  it('uses red color for high risk hotspots', async () => {
    render(<MapViewer />);

    const circleMarkers = await screen.findAllByTestId('circle-marker');
    const highRiskMarker = circleMarkers.find(marker => {
      const dataColor = marker.getAttribute('data-color');
      return dataColor === '#dc2626';
    });

    expect(highRiskMarker).toBeDefined();
  });

  it('uses orange color for medium risk hotspots', async () => {
    render(<MapViewer />);

    const circleMarkers = await screen.findAllByTestId('circle-marker');
    const mediumRiskMarker = circleMarkers.find(marker => {
      const dataColor = marker.getAttribute('data-color');
      return dataColor === '#f97316';
    });

    expect(mediumRiskMarker).toBeDefined();
  });

  it('renders popup with hotspot information', async () => {
    render(<MapViewer />);

    const popups = await screen.findAllByTestId('popup');
    expect(popups.length).toBeGreaterThan(0);
  });
});
