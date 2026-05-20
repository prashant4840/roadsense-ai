# 🎨 FRONTEND DEVELOPMENT ROADMAP

**RoadSense AI - React Dashboard Implementation Plan**

---

## 📋 Overview

Transform the backend API into a complete full-stack application with a professional React frontend.

**Estimated Timeline:** 15-25 hours (varies by experience)  
**Tech Stack:** React/Next.js, TypeScript, Tailwind CSS, Recharts, Leaflet  
**Deployment:** Vercel

---

## 🎯 Phase 1: Project Setup (2 hours)

### Tasks

1. **Create React Project**
   ```bash
   npx create-next-app@latest roadsense-dashboard \
     --typescript \
     --tailwind \
     --eslint
   cd roadsense-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install axios recharts leaflet react-leaflet
   npm install -D @types/leaflet
   ```

3. **Environment Setup**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_URL_PROD=https://roadsense-api.onrender.com
   ```

4. **Project Structure**
   ```
   src/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx
   │   └── globals.css
   ├── components/
   │   ├── PredictionForm.tsx
   │   ├── RiskDisplay.tsx
   │   ├── MapViewer.tsx
   │   ├── Analytics.tsx
   │   └── Header.tsx
   ├── hooks/
   │   └── useApi.ts
   ├── types/
   │   └── index.ts
   ├── utils/
   │   └── api.ts
   └── lib/
       └── constants.ts
   ```

---

## 🎯 Phase 2: API Integration (3 hours)

### Tasks

1. **Create API Client Hook**
   ```typescript
   // hooks/useApi.ts
   export function usePrediction() {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [result, setResult] = useState(null);

     const predict = async (formData: AccidentData) => {
       setLoading(true);
       try {
         const response = await axios.post(
           `${process.env.NEXT_PUBLIC_API_URL}/predict`,
           formData
         );
         setResult(response.data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };

     return { predict, loading, error, result };
   }
   ```

2. **Generate TypeScript Types**
   ```typescript
   // types/index.ts
   export interface AccidentData {
     hour: number;
     is_weekend: number;
     temperature: number;
     vehicles_involved: number;
     casualties: number;
     is_peak_hour: number;
     is_night: number;
     road_type: "highway" | "rural" | "urban";
     weather: "clear" | "fog" | "rain";
     traffic_density: "high" | "low" | "medium";
     visibility: "high" | "low" | "medium";
   }

   export interface PredictionResponse {
     prediction: "HIGH RISK" | "LOW RISK";
     risk_level: 0 | 1;
     confidence: number;
     timestamp: string;
   }
   ```

3. **Health Check Monitoring**
   ```typescript
   // hooks/useHealth.ts
   export function useHealth() {
     const [isHealthy, setIsHealthy] = useState(false);

     useEffect(() => {
       const checkHealth = async () => {
         try {
           const response = await axios.get(
             `${process.env.NEXT_PUBLIC_API_URL}/health`
           );
           setIsHealthy(response.data.status === "healthy");
         } catch {
           setIsHealthy(false);
         }
       };

       checkHealth();
       const interval = setInterval(checkHealth, 30000); // Every 30s
       return () => clearInterval(interval);
     }, []);

     return isHealthy;
   }
   ```

---

## 🎯 Phase 3: UI Components (6-8 hours)

### 3.1 Header Component

```typescript
// components/Header.tsx
export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🛣️ RoadSense AI</h1>
            <p className="text-blue-100">Accident Risk Prediction</p>
          </div>
          <HealthStatus />
        </div>
      </div>
    </header>
  );
}

function HealthStatus() {
  const isHealthy = useHealth();
  return (
    <div className={`flex items-center gap-2 ${isHealthy ? 'text-green-300' : 'text-red-300'}`}>
      <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-300' : 'bg-red-300'}`} />
      <span>{isHealthy ? "API Online" : "API Offline"}</span>
    </div>
  );
}
```

### 3.2 Prediction Form Component

```typescript
// components/PredictionForm.tsx
export function PredictionForm({ onPredict }) {
  const [formData, setFormData] = useState<AccidentData>({
    hour: 14,
    is_weekend: 0,
    temperature: 25,
    vehicles_involved: 2,
    casualties: 1,
    is_peak_hour: 0,
    is_night: 0,
    road_type: "highway",
    weather: "clear",
    traffic_density: "high",
    visibility: "high",
  });

  const { predict, loading, error } = usePrediction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await predict(formData);
    onPredict(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Time & Date</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="0"
            max="23"
            placeholder="Hour (0-23)"
            value={formData.hour}
            onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={formData.is_weekend}
            onChange={(e) => setFormData({...formData, is_weekend: parseInt(e.target.value)})}
            className="px-4 py-2 border rounded-md"
          >
            <option value={0}>Weekday</option>
            <option value={1}>Weekend</option>
          </select>
        </div>
      </div>

      {/* Weather Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weather</h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.weather}
            onChange={(e) => setFormData({...formData, weather: e.target.value})}
            className="px-4 py-2 border rounded-md"
          >
            <option>clear</option>
            <option>fog</option>
            <option>rain</option>
          </select>
          <input
            type="number"
            min="-50"
            max="60"
            placeholder="Temperature"
            value={formData.temperature}
            onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Road & Traffic Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Road & Traffic</h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.road_type}
            onChange={(e) => setFormData({...formData, road_type: e.target.value})}
            className="px-4 py-2 border rounded-md"
          >
            <option>highway</option>
            <option>urban</option>
            <option>rural</option>
          </select>
          <select
            value={formData.traffic_density}
            onChange={(e) => setFormData({...formData, traffic_density: e.target.value})}
            className="px-4 py-2 border rounded-md"
          >
            <option>high</option>
            <option>medium</option>
            <option>low</option>
          </select>
        </div>
      </div>

      {/* Accident Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Accident Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="1"
            placeholder="Vehicles"
            value={formData.vehicles_involved}
            onChange={(e) => setFormData({...formData, vehicles_involved: parseInt(e.target.value)})}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            min="0"
            placeholder="Casualties"
            value={formData.casualties}
            onChange={(e) => setFormData({...formData, casualties: parseInt(e.target.value)})}
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Predicting..." : "Predict Accident Risk"}
      </button>
    </form>
  );
}
```

### 3.3 Risk Display Component

```typescript
// components/RiskDisplay.tsx
export function RiskDisplay({ prediction, risk_level, confidence, timestamp }) {
  const isHighRisk = risk_level === 1;
  
  return (
    <div className={`p-8 rounded-lg shadow-lg ${isHighRisk ? 'bg-red-50' : 'bg-green-50'}`}>
      <div className="flex items-center gap-4">
        <div className={`text-6xl ${isHighRisk ? 'text-red-600' : 'text-green-600'}`}>
          {isHighRisk ? '⚠️' : '✅'}
        </div>
        <div>
          <h2 className="text-3xl font-bold">{prediction}</h2>
          <p className="text-gray-600">Confidence: {(confidence * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-500">{new Date(timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Model Confidence</span>
          <span>{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${isHighRisk ? 'bg-red-600' : 'bg-green-600'}`}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
```

### 3.4 Map Viewer Component

```typescript
// components/MapViewer.tsx
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function MapViewer() {
  const defaultCenter = [22.5937, 78.9629]; // India center
  
  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Example accident hotspots - replace with real data */}
        <CircleMarker center={[28.7041, 77.1025]} radius={8} color="red" fillOpacity={0.7}>
          <Popup>Delhi - High Risk Zone</Popup>
        </CircleMarker>
        
        <CircleMarker center={[19.0760, 72.8777]} radius={8} color="orange" fillOpacity={0.7}>
          <Popup>Mumbai - Medium Risk Zone</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
```

---

## 🎯 Phase 4: Dashboard Layout (4 hours)

### Main Page

```typescript
// app/page.tsx
export default function Home() {
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Prediction Form */}
          <div className="lg:col-span-1">
            <PredictionForm onPredict={setPrediction} />
          </div>

          {/* Right: Results & Map */}
          <div className="lg:col-span-2 space-y-8">
            
            {prediction && (
              <>
                <RiskDisplay {...prediction} />
                
                {/* Analytics */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Temperature Impact</p>
                      <p className="text-2xl font-bold text-blue-600">31.2%</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Time Impact</p>
                      <p className="text-2xl font-bold text-blue-600">22.7%</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Map */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Accident Hotspots</h3>
              <MapViewer />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 RoadSense AI. Built with React & FastAPI.</p>
        </div>
      </footer>
    </div>
  );
}
```

---

## 🎯 Phase 5: Testing & Optimization (3 hours)

### Tasks

1. **Unit Tests**
   ```typescript
   // components/__tests__/PredictionForm.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { PredictionForm } from '../PredictionForm';

   test('submits form with correct data', async () => {
     const mockOnPredict = jest.fn();
     render(<PredictionForm onPredict={mockOnPredict} />);
     
     const button = screen.getByText('Predict Accident Risk');
     fireEvent.click(button);
     
     expect(mockOnPredict).toBeCalled();
   });
   ```

2. **Integration Tests**
   - Test API connectivity
   - Test error handling
   - Test form validation

3. **Performance**
   - Image optimization
   - Code splitting
   - Caching strategies

---

## 🎯 Phase 6: Deployment (2 hours)

### Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# Go to vercel.com → Import Project → Select repo

# 3. Add environment variables
# NEXT_PUBLIC_API_URL=https://roadsense-api.onrender.com

# 4. Deploy
# Vercel automatically deploys on push
```

---

## 📊 Component Tree

```
App
├── Header
│   └── HealthStatus
├── Main
│   ├── PredictionForm
│   │   ├── TimeSection
│   │   ├── WeatherSection
│   │   ├── RoadTrafficSection
│   │   └── AccidentDetailsSection
│   └── Results
│       ├── RiskDisplay
│       ├── RiskFactors
│       └── MapViewer
│           └── Leaflet Map
└── Footer
```

---

## 🎨 Design System

### Color Palette
```
Primary: #2563eb (Blue)
Danger: #dc2626 (Red)
Success: #16a34a (Green)
Warning: #ea580c (Orange)
Background: #f9fafb (Gray)
```

### Tailwind Utility Classes
- Spacing: 4px (0.25rem) baseline
- Border radius: md = 0.375rem, lg = 0.5rem
- Shadows: md = standard, lg = elevated
- Responsive: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 📋 Development Checklist

### Phase 1: Setup
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Set up environment variables
- [ ] Create folder structure

### Phase 2: API Integration
- [ ] Create API client hook
- [ ] Generate TypeScript types
- [ ] Implement health check
- [ ] Test API connectivity

### Phase 3: Components
- [ ] Header component
- [ ] Prediction form
- [ ] Risk display
- [ ] Map viewer
- [ ] Analytics display

### Phase 4: Dashboard
- [ ] Main page layout
- [ ] Component integration
- [ ] Responsive design
- [ ] Error handling

### Phase 5: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance testing
- [ ] Browser testing

### Phase 6: Deployment
- [ ] Push to GitHub
- [ ] Connect Vercel
- [ ] Configure environment
- [ ] Deploy

---

## 🚀 What AI Can Generate

✅ React component scaffolds  
✅ TypeScript type definitions  
✅ Tailwind CSS styling  
✅ API client code  
✅ Test templates  
✅ Form validation logic  
✅ Error handling utilities  

---

## 🧠 What You Should Decide

🧠 Overall UI/UX design  
🧠 Color scheme & branding  
🧠 Component layout  
🧠 Information hierarchy  
🧠 Feature prioritization  
🧠 Future dashboard features  

---

## ⏱️ Timeline Estimate

| Phase | Tasks | Hours | Dependencies |
|-------|-------|-------|---|
| 1 | Setup | 2 | - |
| 2 | API Integration | 3 | Phase 1 |
| 3 | Components | 6-8 | Phase 2 |
| 4 | Dashboard | 4 | Phase 3 |
| 5 | Testing | 3 | Phase 4 |
| 6 | Deployment | 2 | Phase 5 |
| **TOTAL** | | **20-24** | - |

---

## 📚 Reference Implementation

After each phase, test:
```bash
# Dev server
npm run dev

# Production build
npm run build
npm run start

# Tests
npm test
```

---

## 🎯 Success Criteria

✅ Form accepts all accident data inputs  
✅ Prediction requests succeed  
✅ Risk display shows results clearly  
✅ Map displays accident hotspots  
✅ Responsive on mobile/tablet/desktop  
✅ Error messages helpful  
✅ Loading states visible  
✅ Deploys to Vercel without errors  

---

**Ready to build the frontend? Let's go! 🚀**
