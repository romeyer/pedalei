# 🚴‍♂️ Pedalei

**Pedalei** is a web app designed for cyclists who need real-time navigation with clear voice guidance. It solves common problems faced when using Google Maps while cycling.

## 🎯 Key Features

- **Smart Route Planning**: Create routes with start point, destination, and optional waypoints
- **Cycling-Optimized Navigation**: Uses Google Maps Directions API specifically for cycling
- **Voice Guidance**: Real-time voice commands with simple, human-friendly phrases
- **Ride Dashboard**: Track distance, duration, elevation gain, and CO₂ saved
- **Gamification**: Level up based on kilometers cycled
- **Route History**: Save and review all your cycling adventures
- **User Authentication**: Secure login system with email + password

## 🛠️ Tech Stack

- **Frontend**: React, React Router, @react-google-maps/api, Styled Components
- **State Management**: React Context API
- **External APIs**: Google Maps (Directions, Places, Elevation)
- **UI/UX**: Styled Components, React Icons
- **Authentication**: Local storage (will be replaced with JWT)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pedalei.git
   cd pedalei
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Maps API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Google Maps API Setup

You'll need to enable the following APIs in your Google Cloud Console:
- Maps JavaScript API
- Directions API
- Places API
- Elevation API

## 📱 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your cycling stats and recent routes
3. **Plan Route**: Use the "New Route" page to plan your cycling route
4. **Start Navigation**: Begin your ride with voice-guided navigation
5. **Track Progress**: Monitor your cycling achievements and level up

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   └── ProtectedRoute.js # Route protection
├── contexts/           # React Context providers
│   └── AuthContext.js  # Authentication state
├── pages/              # Main application pages
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # User dashboard
│   ├── NewRoute.js     # Route planning
│   └── History.js      # Route history
├── hooks/              # Custom React hooks
├── services/           # API calls and external services
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🎮 Features in Development

- **Voice Navigation**: Real-time turn-by-turn voice instructions
- **Backend API**: Node.js + Express + MongoDB
- **Strava Integration**: Auto-post completed rides
- **Offline Support**: Cache routes for offline navigation
- **Weather Integration**: Real-time weather conditions
- **Social Features**: Share routes with the cycling community

## 📋 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps API for mapping and directions
- React community for excellent libraries
- Cycling community for inspiration and feedback

---

**Happy Cycling! 🚴‍♂️🌟**
