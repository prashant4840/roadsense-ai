# RoadSense AI Frontend

A modern React/Next.js dashboard for accident risk prediction powered by the RoadSense AI backend.

## Features

- 🔮 Real-time accident risk prediction
- 📊 Interactive charts and analytics (Recharts)
- 🗺️ Interactive accident hotspot maps (Leaflet)
- ⚡ Fast & responsive UI with Tailwind CSS
- 🎨 Beautiful modern design
- 📱 Mobile-friendly responsive layout
- ✅ Form validation & error handling
- 🌐 API integration with error recovery

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - your app auto-reloads as you edit.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL_PROD=https://roadsense-api.onrender.com
```

## Project Structure

```
frontend/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with AppProvider
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global Tailwind styles
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── PredictionForm.tsx
│   │   ├── RiskDisplay.tsx
│   │   ├── MapViewer.tsx
│   │   ├── RiskFactors.tsx
│   │   └── Footer.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── usePrediction.ts
│   │   ├── useHealth.ts
│   │   ├── useFormState.ts
│   │   └── useFormValidation.ts
│   ├── context/             # React context
│   │   └── AppContext.tsx   # Global app state
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── api.ts           # API client
│   └── lib/                 # Constants
│       └── constants.ts
├── package.json
├── Dockerfile
├── docker-compose.yml
├── vercel.json
└── DEPLOYMENT.md
```

## Components

### PredictionForm
Input form for accident data with validation
- Time, weather, visibility, road, and accident details
- Real-time validation
- Error messages

### RiskDisplay
Shows prediction results with confidence score
- Risk level indicator
- Confidence bar
- Recommendation

### MapViewer
Interactive map of accident hotspots
- Leaflet-based map
- Marker clusters
- Popup information

### RiskFactors
Bar chart showing feature importance
- Top 6 most important factors
- Recharts visualization

## API Integration

**Backend API**: `http://localhost:8000`

Endpoints:
- `POST /predict` - Get accident risk prediction
- `GET /health` - Check API status
- `GET /docs` - Swagger documentation

## Tech Stack

- **Framework**: Next.js 16+ (React 19)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet & react-leaflet
- **HTTP**: Axios
- **Language**: TypeScript
- **Form Validation**: Custom hooks
- **Deployment**: Vercel, Railway, Docker

## Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# Go to vercel.com/new
# Select your repo
# Root directory: frontend
# Set NEXT_PUBLIC_API_URL_PROD

# 3. Auto-deploy on push
```

### Docker

```bash
# Build image
docker build -t roadsense-frontend .

# Run container
docker run -p 3000:3000 roadsense-frontend
```

### Docker Compose (Full Stack)

```bash
# From project root
docker-compose up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guides.

## Performance

✅ Automatic image optimization  
✅ CSS minification  
✅ JavaScript code splitting  
✅ Font optimization  
✅ Dynamic imports for large components  
✅ Production builds: ~100KB gzipped  

## Development

### Code Standards

- ESLint configured
- TypeScript strict mode
- Prettier for formatting
- Component-based architecture

### Testing

```bash
npm test
npm run test:watch
```

### Build & Analyze

```bash
npm run build
# Check bundle size in .next/static
```

## Environment Support

- Node.js 18+
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Not Connecting
- Ensure backend is running at configured URL
- Check environment variables
- Verify CORS in backend

### Build Errors
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Port Already in Use
```bash
# Change port in package.json or
PORT=3001 npm run dev
```

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

MIT

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Leaflet](https://leafletjs.com)

