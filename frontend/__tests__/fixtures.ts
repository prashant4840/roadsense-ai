export const testFixtures = {
  formValidationScenarios: [
    {
      name: 'valid form data',
      data: {
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
      },
      expectedErrors: {},
    },
    {
      name: 'invalid hour',
      data: {
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
      },
      expectedErrors: { hour: 'Hour must be between 0 and 23' },
    },
  ],

  predictionScenarios: [
    {
      name: 'high risk prediction',
      data: {
        hour: 22,
        is_weekend: 1,
        temperature: 10,
        vehicles_involved: 3,
        casualties: 2,
        is_peak_hour: 1,
        is_night: 1,
        road_type: 'highway',
        weather: 'rain',
        traffic_density: 'high',
        visibility: 'low',
      },
      expectedRisk: 0.85,
    },
    {
      name: 'low risk prediction',
      data: {
        hour: 10,
        is_weekend: 0,
        temperature: 20,
        vehicles_involved: 1,
        casualties: 0,
        is_peak_hour: 0,
        is_night: 0,
        road_type: 'residential',
        weather: 'clear',
        traffic_density: 'low',
        visibility: 'high',
      },
      expectedRisk: 0.2,
    },
  ],

  errorScenarios: [
    {
      name: 'network timeout',
      error: 'Request timeout. Please check your connection.',
      statusCode: undefined,
    },
    {
      name: 'bad request',
      error: 'Invalid input. Please check your data.',
      statusCode: 400,
    },
    {
      name: 'not found',
      error: 'API endpoint not found. Backend may be down.',
      statusCode: 404,
    },
    {
      name: 'server error',
      error: 'Server error. Please try again later.',
      statusCode: 500,
    },
    {
      name: 'network error',
      error: 'Network error. Please check your internet connection.',
      statusCode: undefined,
    },
  ],

  roadTypes: ['highway', 'urban', 'rural', 'motorway'],
  weatherConditions: ['clear', 'rain', 'fog', 'snow'],
  trafficDensities: ['low', 'medium', 'high'],
  visibilityLevels: ['low', 'medium', 'high'],
};
