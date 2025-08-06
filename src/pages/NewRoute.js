import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Autocomplete, Marker } from '@react-google-maps/api';
import styled from 'styled-components';
import { FiMapPin, FiNavigation, FiPlus, FiTrash2, FiPlay, FiPause, FiSquare, FiTarget } from 'react-icons/fi';

const Container = styled.div`
  height: calc(100vh - 80px);
  display: flex;
`;

const Sidebar = styled.div`
  width: 400px;
  background: white;
  padding: 1.5rem;
  box-shadow: 2px 0 4px rgba(0,0,0,0.1);
  overflow-y: auto;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const WaypointContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background: #c0392b;
  }
`;

const AddWaypointButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: #2980b9;
  }
`;

const StartButton = styled.button`
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    background: #229954;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const RouteInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const DifficultyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.color};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ElevationInfo = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const LocationButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-top: 0.5rem;
  
  &:hover {
    color: #2980b9;
  }
  
  &:disabled {
    color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const LocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const NavigationPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const NavigationPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const NavigationTitle = styled.h3`
  margin: 0;
  color: #ecf0f1;
`;

const StopNavigationButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #c0392b;
  }
`;

const CurrentInstruction = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const NavigationProgress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #bdc3c7;
`;

const StepCounter = styled.div`
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 1rem;
  width: 100%;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const RouteChangedNotice = styled.div`
  background: #f39c12;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const RecalculatingNotice = styled.div`
  background: #e74c3c;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const OffRouteNotice = styled.div`
  background: #e67e22;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
  animation: slideIn 0.3s ease-out;
`;

const LanguageSelector = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const LanguageLabel = styled.label`
  display: block;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const LanguageSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

// Cycling Preferences Components
const PreferencesSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #ecf0f1;
`;

const PreferencesTitle = styled.h3`
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreferenceOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #ecf0f1;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3498db;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PreferenceLabel = styled.label`
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreferenceDescription = styled.div`
  font-size: 0.75rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${props => props.active ? '#27ae60' : '#bdc3c7'};
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '28px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const ToggleLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.active ? '#27ae60' : '#e74c3c'};
  margin-left: 0.5rem;
  min-width: 30px;
`;

// Navigation View Components
const NavigationView = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background: #000;
  display: flex;
  flex-direction: column;
`;

const DynamicNavigationHeader = styled.div`
  background: rgba(0,0,0,0.9);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2001;
`;

const NavigationInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const NextInstruction = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const DistanceToStep = styled.div`
  font-size: 0.9rem;
  color: #bdc3c7;
`;

const ExitNavigationButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #c0392b;
  }
`;

const NavigationMap = styled.div`
  flex: 1;
  position: relative;
`;

const NextStepPreview = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  min-width: 250px;
  z-index: 2001;
`;

const NextStepTitle = styled.div`
  font-size: 0.8rem;
  color: #bdc3c7;
  margin-bottom: 0.5rem;
`;

const NextStepInstruction = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const NextStepDistance = styled.div`
  font-size: 0.9rem;
  color: #f39c12;
`;

const RouteProgress = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 2rem;
  z-index: 2001;
`;

const ProgressItem = styled.div`
  text-align: center;
`;

const ProgressValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #3498db;
`;

const ProgressLabel = styled.div`
  font-size: 0.8rem;
  color: #bdc3c7;
`;

// Activity Tracking Interface Components
const ActivityPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #e74c3c;
  color: white;
  z-index: 2002;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
`;

const ActivityHeader = styled.div`
  padding: 1rem;
  text-align: center;
  background: rgba(0,0,0,0.1);
  border-radius: 20px 20px 0 0;
  font-weight: bold;
  font-size: 1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  color: #2c3e50;
`;

const MetricCard = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
`;

const SecondaryMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0 1.5rem 1rem;
  background: white;
  color: #2c3e50;
`;

const SecondaryMetric = styled.div`
  text-align: center;
`;

const SecondaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 0.25rem;
`;

const SecondaryLabel = styled.div`
  font-size: 0.7rem;
  color: #95a5a6;
  text-transform: uppercase;
  font-weight: 600;
`;

const ControlButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0 0 20px 20px;
`;

const ControlButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }
  
  &.play-pause {
    background: ${props => props.isPaused ? '#27ae60' : '#f39c12'};
    color: white;
  }
  
  &.stop {
    background: #e74c3c;
    color: white;
  }
  
  &.location {
    background: #3498db;
    color: white;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -23.5505,
  lng: -46.6333
};

const libraries = ['places', 'geometry'];

// Note: Instructions are now simplified before translation to avoid compass directions
// The simplifyInstruction function handles the conversion to cycling-friendly directions

const NewRoute = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const sidebarRef = useRef(null);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true);
  const [currentLocationCoords, setCurrentLocationCoords] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [showBikeLayer, setShowBikeLayer] = useState(false);
  const [bikeLayer, setBikeLayer] = useState(null);
  const [showRouteChangedNotice, setShowRouteChangedNotice] = useState(false);
  const [language, setLanguage] = useState('pt-BR');
  const [distanceToNextStep, setDistanceToNextStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [userHeading, setUserHeading] = useState(0);
  const [previousLocation, setPreviousLocation] = useState(null);
  
  // Cycling preferences
  const [preferBikeLanes, setPreferBikeLanes] = useState(true);
  const [avoidHighways, setAvoidHighways] = useState(true);
  const [avoidExpressways, setAvoidExpressways] = useState(true);
  const [followTrafficLaws, setFollowTrafficLaws] = useState(true);
  
  // Route recalculation states
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [recalculatingRoute, setRecalculatingRoute] = useState(false);
  const [lastKnownRoutePosition, setLastKnownRoutePosition] = useState(null);
  
  // Activity tracking states
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [lastPositionForDistance, setLastPositionForDistance] = useState(null);
  
  // Auto-pause states
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [lastMovementTime, setLastMovementTime] = useState(null);
  const [lastKnownPosition, setLastKnownPosition] = useState(null);
  const [stationaryStartTime, setStationaryStartTime] = useState(null);
  
  // GPS Simulation states (for testing)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x = normal speed
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  
  const originRef = useRef();
  const destinationRef = useRef();
  const waypointRefs = useRef([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    version: 'weekly'
  });

  // Debug Google Maps API key loading
  useEffect(() => {
    console.log('🔍 Google Maps Debug Info:');
    console.log('- API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Present' : '❌ MISSING');
    console.log('- Load Error:', loadError);
    console.log('- Is Loaded:', isLoaded);
    console.log('- Google Maps Available:', typeof window.google !== 'undefined');
    
    if (loadError) {
      console.error('🚨 Google Maps Load Error:', loadError);
    }
    
    // Test API connectivity when loaded
    if (isLoaded && !loadError) {
      console.log('✅ Google Maps loaded successfully');
      
      // Test basic geocoding functionality
      const testGeocoder = () => {
        try {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: 'São Paulo, Brazil' }, (results, status) => {
            if (status === 'OK') {
              console.log('✅ Geocoding API working');
            } else {
              console.log('❌ Geocoding API failed:', status);
            }
          });
        } catch (error) {
          console.log('❌ Geocoding test error:', error);
        }
      };
      
      setTimeout(testGeocoder, 1000);
    }
  }, [loadError, isLoaded]);

  // Get user's current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Cleanup bike layer monitor on unmount
  useEffect(() => {
    return () => {
      if (map) {
        if (map._bikLayerMonitor) {
          clearInterval(map._bikLayerMonitor);
          console.log('Cleaned up bike layer monitor');
        }
        if (map._elementHideInterval) {
          clearInterval(map._elementHideInterval);
          console.log('Cleaned up element hide interval');
        }
      }
    };
  }, [map]);

  // Effect to sync bike layer visibility when map or showBikeLayer changes
  useEffect(() => {
    if (map && bikeLayer) {
      console.log('Syncing bike layer visibility:', showBikeLayer);
      if (showBikeLayer) {
        bikeLayer.setMap(map);
      } else {
        bikeLayer.setMap(null);
      }
    }
  }, [map, bikeLayer, showBikeLayer]);

  // Effect to force hide bike layer when directions change
  useEffect(() => {
    if (directions && !showBikeLayer) {
      console.log('Route calculated - ensuring bike layer stays hidden');
      
      // Clear any existing bike layer
      if (bikeLayer) {
        bikeLayer.setMap(null);
      }
      
      // Use a single timeout to ensure the layer stays hidden after route rendering
      const hideTimer = setTimeout(() => {
        // Remove our controlled bike layer
        if (bikeLayer) {
          bikeLayer.setMap(null);
        }
        
        // Also check for any Google-created bicycle layers and remove them
        if (map) {
          // Get all overlayMapTypes and remove bicycle-related ones
          const overlays = map.overlayMapTypes;
          if (overlays && overlays.getLength() > 0) {
            for (let i = overlays.getLength() - 1; i >= 0; i--) {
              const overlay = overlays.getAt(i);
              // Remove if it's a bicycle layer (Google may add these automatically)
              if (overlay && overlay.toString && overlay.toString().includes('bicycle')) {
                console.log('Removing auto-generated bicycle overlay');
                overlays.removeAt(i);
              }
            }
          }
        }
      }, 100);
      
      return () => clearTimeout(hideTimer);
    }
  }, [directions, bikeLayer, showBikeLayer, map]);

  // Timer effect for activity tracking
  useEffect(() => {
    let interval = null;
    
    if (isNavigating && startTime && !isPaused && !isAutoPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        
        // Update calories based on current distance
        const calories = calculateCalories(totalDistance / 1000, elapsed);
        setCaloriesBurned(calories);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, startTime, isPaused, isAutoPaused, totalDistance]);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocationCoords(coords);
          
          // Convert coordinates to address using reverse geocoding
          if (isLoaded && !loadError) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: coords }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setOrigin(results[0].formatted_address);
              } else {
                setOrigin('Minha Localização');
              }
              setLocationLoading(false);
            });
          } else {
            setOrigin('Minha Localização');
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsUsingCurrentLocation(false);
          setLocationLoading(false);
          // Don't show alert, just let user type manually
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setIsUsingCurrentLocation(false);
      setLocationLoading(false);
    }
  };

  const clearRoute = () => {
    setDirections(null);
    setRouteInfo(null);
    setNavigationSteps([]);
    setIsNavigating(false);
    setCurrentStepIndex(0);
    setUserLocation(null);
    window.speechSynthesis.cancel();
    
    // Show notice that route was cleared
    setShowRouteChangedNotice(true);
    setTimeout(() => {
      setShowRouteChangedNotice(false);
    }, 3000);
  };

  const handleOriginChange = (value) => {
    setOrigin(value);
    if (value !== 'Minha Localização') {
      setIsUsingCurrentLocation(false);
    }
    // Clear route when origin changes
    if (directions) {
      clearRoute();
    }
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
    // Clear route when destination changes
    if (directions) {
      clearRoute();
    }
  };

  const useCurrentLocationAgain = () => {
    setIsUsingCurrentLocation(true);
    getCurrentLocation();
  };

  const simplifyInstruction = (instruction) => {
    // Convert complex/technical directions to simple cycling instructions
    let simplified = instruction.toLowerCase();
    
    // Replace compass directions with simple instructions
    simplified = simplified.replace(/head\s+(north|south|east|west|northeast|northwest|southeast|southwest)/gi, 'Siga em frente');
    simplified = simplified.replace(/continue\s+(north|south|east|west|northeast|northwest|southeast|southwest)/gi, 'Continue em frente');
    simplified = simplified.replace(/go\s+(north|south|east|west|northeast|northwest|southeast|southwest)/gi, 'Siga em frente');
    
    // Simplify turn instructions
    simplified = simplified.replace(/turn sharp left/gi, 'Vire à esquerda');
    simplified = simplified.replace(/turn sharp right/gi, 'Vire à direita');
    simplified = simplified.replace(/turn slight left/gi, 'Mantenha-se à esquerda');
    simplified = simplified.replace(/turn slight right/gi, 'Mantenha-se à direita');
    simplified = simplified.replace(/turn left/gi, 'Vire à esquerda');
    simplified = simplified.replace(/turn right/gi, 'Vire à direita');
    
    // Simplify keep instructions
    simplified = simplified.replace(/keep left/gi, 'Mantenha-se à esquerda');
    simplified = simplified.replace(/keep right/gi, 'Mantenha-se à direita');
    
    // Handle merge/ramp/highway instructions (less common for cycling but may appear)
    simplified = simplified.replace(/merge/gi, 'Continue');
    simplified = simplified.replace(/take.*ramp/gi, 'Siga pela saída');
    simplified = simplified.replace(/take.*exit/gi, 'Pegue a saída');
    
    // U-turn
    simplified = simplified.replace(/make a u-turn/gi, 'Faça um retorno');
    simplified = simplified.replace(/u-turn/gi, 'Faça um retorno');
    
    // Continue straight
    simplified = simplified.replace(/continue straight/gi, 'Continue em frente');
    simplified = simplified.replace(/go straight/gi, 'Siga em frente');
    simplified = simplified.replace(/continue/gi, 'Continue em frente');
    
    // Roundabout instructions
    simplified = simplified.replace(/enter.*roundabout.*take.*1st.*exit/gi, 'Na rotatória, pegue a primeira saída');
    simplified = simplified.replace(/enter.*roundabout.*take.*2nd.*exit/gi, 'Na rotatória, pegue a segunda saída');
    simplified = simplified.replace(/enter.*roundabout.*take.*3rd.*exit/gi, 'Na rotatória, pegue a terceira saída');
    simplified = simplified.replace(/enter.*roundabout.*take.*4th.*exit/gi, 'Na rotatória, pegue a quarta saída');
    simplified = simplified.replace(/enter.*roundabout/gi, 'Entre na rotatória');
    
    // Clean up any remaining compass references
    simplified = simplified.replace(/(north|south|east|west|northeast|northwest|southeast|southwest)/gi, '');
    simplified = simplified.replace(/toward/gi, 'em direção a');
    simplified = simplified.replace(/\s+/g, ' '); // Clean multiple spaces
    simplified = simplified.trim();
    
    // Capitalize first letter
    return simplified.charAt(0).toUpperCase() + simplified.slice(1);
  };

  const translateInstruction = (instruction, targetLanguage) => {
    // First simplify the instruction to make it cycling-friendly
    const simplifiedInstruction = simplifyInstruction(instruction);
    
    if (targetLanguage === 'en-US') {
      // For English, translate simplified Portuguese back to English
      let englishInstruction = simplifiedInstruction;
      englishInstruction = englishInstruction.replace(/Siga em frente/gi, 'Go straight');
      englishInstruction = englishInstruction.replace(/Continue em frente/gi, 'Continue straight');
      englishInstruction = englishInstruction.replace(/Vire à esquerda/gi, 'Turn left');
      englishInstruction = englishInstruction.replace(/Vire à direita/gi, 'Turn right');
      englishInstruction = englishInstruction.replace(/Mantenha-se à esquerda/gi, 'Keep left');
      englishInstruction = englishInstruction.replace(/Mantenha-se à direita/gi, 'Keep right');
      englishInstruction = englishInstruction.replace(/Faça um retorno/gi, 'Make a U-turn');
      englishInstruction = englishInstruction.replace(/Na rotatória, pegue a/gi, 'At the roundabout, take the');
      englishInstruction = englishInstruction.replace(/primeira saída/gi, 'first exit');
      englishInstruction = englishInstruction.replace(/segunda saída/gi, 'second exit');
      englishInstruction = englishInstruction.replace(/terceira saída/gi, 'third exit');
      englishInstruction = englishInstruction.replace(/quarta saída/gi, 'fourth exit');
      englishInstruction = englishInstruction.replace(/Entre na rotatória/gi, 'Enter the roundabout');
      englishInstruction = englishInstruction.replace(/Pegue a saída/gi, 'Take the exit');
      englishInstruction = englishInstruction.replace(/em direção a/gi, 'toward');
      return englishInstruction;
    }
    
    // For Portuguese, return the simplified instruction
    return simplifiedInstruction;
  };

  const handleRouteSuccess = (result) => {
    // If we got alternatives, select the best one based on preferences
    if (result.routes && result.routes.length > 1) {
      console.log(`Found ${result.routes.length} route alternatives`);
      
      // Score routes based on preferences
      let bestRoute = result.routes[0];
      let bestScore = scoreRoute(bestRoute);
      
      for (let i = 1; i < result.routes.length; i++) {
        const route = result.routes[i];
        const score = scoreRoute(route);
        if (score > bestScore) {
          bestRoute = route;
          bestScore = score;
          // Update the result to use the best route
          result.routes = [bestRoute];
        }
      }
      
      console.log(`Selected route with score: ${bestScore}`);
    }

    // Process the result
    processRouteResult(result);
  };

  const calculateRoute = useCallback(async () => {
    console.log('calculateRoute called with:', { origin, destination, currentLocationCoords, isUsingCurrentLocation });
    
    if (!origin || !destination) {
      alert('Por favor, preencha origem e destino');
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const waypointsFormatted = waypoints
        .filter(wp => wp.trim())
        .map(wp => ({
          location: wp,
          stopover: true
        }));

      const routeOrigin = isUsingCurrentLocation && currentLocationCoords 
        ? currentLocationCoords 
        : origin;

      // Configure route options based on user preferences
      const routeOptions = {
        origin: routeOrigin,
        destination,
        waypoints: waypointsFormatted,
        travelMode: window.google.maps.TravelMode.BICYCLING,
        optimizeWaypoints: true,
        // When following traffic laws, respect highway/toll avoidance
        // When NOT following traffic laws, allow more flexible routing (ignore some restrictions)
        avoidHighways: followTrafficLaws ? avoidHighways : false,
        avoidTolls: followTrafficLaws ? avoidExpressways : false,
        provideRouteAlternatives: true,
        // Additional cycling-specific preferences
        ...(preferBikeLanes && followTrafficLaws && {
          // When both bike lanes preference and traffic laws are enabled,
          // we'll prioritize bike-friendly routes in the scoring
          region: 'BR'
        })
      };

      console.log('Route preferences applied:', {
        preferBikeLanes,
        avoidHighways,
        avoidExpressways,
        followTrafficLaws,
        routeOptions
      });

      // When not following traffic laws, try multiple routing strategies for flexibility
      if (!followTrafficLaws) {
        console.log('🚫 Traffic laws disabled - trying flexible routing strategies');
        
        const flexibleStrategies = [
          // Strategy 1: No restrictions at all
          {
            ...routeOptions,
            avoidHighways: false,
            avoidTolls: false,
            optimizeWaypoints: false // Allow more direct routes
          },
          // Strategy 2: WALKING mode for maximum flexibility (converted to cycling display)
          {
            ...routeOptions,
            travelMode: window.google.maps.TravelMode.WALKING,
            avoidHighways: false,
            avoidTolls: false
          },
          // Strategy 3: Original cycling with no restrictions
          routeOptions
        ];
        
        let bestResult = null;
        let bestScore = -1;
        let completedRequests = 0;
        
        const processStrategy = (strategyOptions, strategyIndex) => {
          directionsService.route(strategyOptions, (result, status) => {
            completedRequests++;
            
            if (status === window.google.maps.DirectionsStatus.OK) {
              console.log(`✅ Flexible strategy ${strategyIndex + 1} succeeded`);
              
              const routeScore = scoreRoute(result.routes[0]);
              if (routeScore > bestScore) {
                bestResult = result;
                bestScore = routeScore;
                console.log(`🏆 New best flexible route found with score: ${routeScore}`);
              }
            } else {
              console.log(`❌ Flexible strategy ${strategyIndex + 1} failed:`, status);
            }
            
            // If all strategies completed, use the best result
            if (completedRequests === flexibleStrategies.length) {
              if (bestResult) {
                console.log('🎯 Using best flexible route');
                handleRouteSuccess(bestResult);
              } else {
                console.error('❌ All flexible routing strategies failed');
                alert('Erro ao calcular rota flexível. Tente habilitar "Seguir Leis de Trânsito".');
              }
            }
          });
        };
        
        // Try all flexible strategies
        flexibleStrategies.forEach((strategy, index) => {
          setTimeout(() => processStrategy(strategy, index), index * 100); // Stagger requests
        });
        
        return; // Exit early for flexible routing
      }

      // Standard routing when following traffic laws
      directionsService.route(routeOptions, async (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log('Route calculated successfully:', result);
          handleRouteSuccess(result);
          
        } else {
          console.error('Directions request failed due to ' + status);
          alert('Erro ao calcular rota: ' + status + '. Verifique os endereços.');
        }
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Erro ao calcular rota. Tente novamente.');
    }
  }, [origin, destination, waypoints, preferBikeLanes, avoidHighways, avoidExpressways, followTrafficLaws, currentLocationCoords, isUsingCurrentLocation]);

  const scoreRoute = (route) => {
    if (!route || !route.legs) return 0;
    
    let score = 100; // Base score
    const totalDistance = route.legs.reduce((total, leg) => total + leg.distance.value, 0);
    const totalDuration = route.legs.reduce((total, leg) => total + leg.duration.value, 0);
    
    // Penalize longer routes if user wants bike lanes (they might be longer but safer)
    if (preferBikeLanes) {
      score += Math.max(0, 50 - (totalDistance / 1000)); // Bonus for shorter routes up to 50km
    } else {
      score += Math.max(0, 100 - (totalDuration / 60)); // Bonus for faster routes
    }
    
    // Check route instructions for various road types and maneuvers
    let highwaySteps = 0;
    let uturnSteps = 0;
    let totalSteps = 0;
    let complexManeuvers = 0;
    
    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        totalSteps++;
        const instruction = step.instructions.toLowerCase();
        
        // Check for highways/expressways
        if (instruction.includes('highway') || instruction.includes('expressway') || 
            instruction.includes('freeway') || instruction.includes('motorway')) {
          highwaySteps++;
        }
        
        // Check for U-turns and potentially illegal maneuvers
        if (instruction.includes('u-turn') || instruction.includes('turn around')) {
          uturnSteps++;
        }
        
        // Check for complex maneuvers that might violate traffic laws
        if (instruction.includes('sharp') || instruction.includes('merge') || 
            instruction.includes('ramp') || instruction.includes('against')) {
          complexManeuvers++;
        }
      });
    });
    
    const highwayRatio = totalSteps > 0 ? highwaySteps / totalSteps : 0;
    const uturnRatio = totalSteps > 0 ? uturnSteps / totalSteps : 0;
    const complexRatio = totalSteps > 0 ? complexManeuvers / totalSteps : 0;
    
    // Apply preferences
    if (avoidHighways && highwayRatio > 0.1) {
      score -= highwayRatio * 50; // Penalize highway usage
    }
    
    if (avoidExpressways && highwayRatio > 0.05) {
      score -= highwayRatio * 30; // Penalize expressway usage
    }
    
    // Traffic law considerations
    if (followTrafficLaws) {
      // Penalize routes with many U-turns (potentially illegal)
      if (uturnRatio > 0.1) {
        score -= uturnRatio * 40;
      }
      
      // Penalize complex maneuvers that might be illegal
      if (complexRatio > 0.2) {
        score -= complexRatio * 25;
      }
      
      // Bonus for routes with fewer complex maneuvers
      score += Math.max(0, 20 - (complexManeuvers * 2));
    } else {
      // When not following traffic laws, prefer faster/shorter routes even with complex maneuvers
      score += Math.max(0, 50 - (totalDuration / 60)); // Strong bonus for time efficiency
      score += Math.max(0, 30 - (totalDistance / 1000)); // Bonus for shorter distance
      
      // Don't penalize U-turns or complex maneuvers when flexibility is wanted
      score += uturnRatio * 15; // Bonus for direct routes with U-turns
      score += complexRatio * 10; // Bonus for taking shortcuts
      
      // Strong penalty for very long routes (prefer direct paths)
      if (totalDistance > 50000) { // More than 50km
        score -= (totalDistance / 1000) * 2;
      }
      
      console.log(`Flexible route scoring: distance=${(totalDistance/1000).toFixed(1)}km, duration=${(totalDuration/60).toFixed(1)}min, u-turns=${uturnRatio.toFixed(2)}, score=${score}`);
    }
    
    return Math.max(0, score);
  };

  const processRouteResult = (result) => {
    setDirections(result);
    
    // Aggressive approach to ensure bike layer stays hidden after route calculation
    if (!showBikeLayer && bikeLayer) {
      console.log('Processing route result - hiding bike layer');
      bikeLayer.setMap(null);
    }
    
    // Force hide bicycle features that Google Maps might show automatically
    if (map && !showBikeLayer) {
      console.log('🚫 Force hiding bicycle features after route calculation');
      
      // Remove any overlays that might have been added
      const overlays = map.overlayMapTypes;
      if (overlays && overlays.getLength() > 0) {
        for (let i = overlays.getLength() - 1; i >= 0; i--) {
          const overlay = overlays.getAt(i);
          if (overlay) {
            console.log('Removing overlay after route calculation');
            overlays.removeAt(i);
          }
        }
      }
      
      // Apply minimal styles to hide only bicycle features
      const hideBicycleOnly = [
        {
          featureType: 'road.bicycle',
          stylers: [{ visibility: 'off' }]
        }
      ];
      
      // Apply minimal bicycle hiding styles
      map.setOptions({ styles: hideBicycleOnly });
      
      // Additional check after a delay
      setTimeout(() => {
        if (!showBikeLayer && map.overlayMapTypes) {
          const overlaysCheck = map.overlayMapTypes;
          for (let i = overlaysCheck.getLength() - 1; i >= 0; i--) {
            overlaysCheck.removeAt(i);
          }
        }
      }, 1000);
    }
    
    const route = result.routes[0];
    const totalDistance = route.legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000;
    const totalDuration = route.legs.reduce((total, leg) => total + leg.duration.value, 0) / 60;
    
    // Get elevation data
    const elevationService = new window.google.maps.ElevationService();
    const path = route.overview_path;
    const elevationPoints = [];
    
    // Sample points along the route for elevation
    for (let i = 0; i < path.length; i += Math.max(1, Math.floor(path.length / 20))) {
      elevationPoints.push(path[i]);
    }
    
    elevationService.getElevationForLocations({
      locations: elevationPoints
    }, (elevationResults, elevationStatus) => {
      let elevationGain = 0;
      let maxElevation = 0;
      let minElevation = Infinity;
      let difficulty = 'Fácil';
      let difficultyColor = '#27ae60';
      
      if (elevationStatus === 'OK' && elevationResults) {
        elevationResults.forEach((result, index) => {
          const elevation = result.elevation;
          maxElevation = Math.max(maxElevation, elevation);
          minElevation = Math.min(minElevation, elevation);
          
          if (index > 0) {
            const gain = elevation - elevationResults[index - 1].elevation;
            if (gain > 0) elevationGain += gain;
          }
        });
        
        // Calculate difficulty based on elevation gain and distance
        const elevationGainPerKm = elevationGain / totalDistance;
        
        if (elevationGainPerKm > 50 || elevationGain > 800) {
          difficulty = 'Muito Difícil';
          difficultyColor = '#e74c3c';
        } else if (elevationGainPerKm > 30 || elevationGain > 400) {
          difficulty = 'Difícil';
          difficultyColor = '#f39c12';
        } else if (elevationGainPerKm > 15 || elevationGain > 200) {
          difficulty = 'Moderado';
          difficultyColor = '#f39c12';
        } else {
          difficulty = 'Fácil';
          difficultyColor = '#27ae60';
        }
      }
      
      setRouteInfo({
        distance: totalDistance,
        duration: totalDuration,
        co2Saved: totalDistance * 0.21,
        elevationGain: Math.round(elevationGain),
        maxElevation: Math.round(maxElevation),
        minElevation: Math.round(minElevation),
        difficulty,
        difficultyColor
      });

      // Auto-scroll to show route results
      setTimeout(() => {
        if (sidebarRef.current) {
          const routeInfoElement = sidebarRef.current.querySelector('[data-route-info]');
          if (routeInfoElement) {
            routeInfoElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, 500);
    });

    // Extract navigation steps
    const steps = [];
    route.legs.forEach((leg, legIndex) => {
      leg.steps.forEach((step, stepIndex) => {
        const originalInstruction = step.instructions.replace(/<[^>]*>/g, ''); // Remove HTML tags
        steps.push({
          id: `${legIndex}-${stepIndex}`,
          instruction: originalInstruction,
          translatedInstruction: translateInstruction(originalInstruction, language),
          distance: step.distance.text,
          duration: step.duration.text,
          maneuver: step.maneuver || 'straight',
          location: {
            lat: step.start_location.lat(),
            lng: step.start_location.lng()
          }
        });
      });
    });
    setNavigationSteps(steps);
  };

  const recalculateRoute = async (currentLocation, targetDestination) => {
    if (recalculatingRoute) return; // Prevent multiple simultaneous recalculations
    
    setRecalculatingRoute(true);
    console.log('Recalculating route from current location...');
    
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const recalcOptions = {
        origin: currentLocation,
        destination: targetDestination,
        travelMode: window.google.maps.TravelMode.BICYCLING,
        avoidHighways: followTrafficLaws ? avoidHighways : false, // More flexible when not following laws
        avoidTolls: followTrafficLaws ? avoidExpressways : false,
        provideRouteAlternatives: !followTrafficLaws // More alternatives when flexible
      };

      directionsService.route(recalcOptions, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log('Route recalculated successfully');
          
          // Analyze if the new route suggests going back or continuing forward
          const newRoute = result.routes[0];
          const firstStep = newRoute.legs[0].steps[0];
          const firstInstruction = firstStep.instructions.toLowerCase();
          
          // Check if the route suggests a U-turn or going back
          const suggestsUTurn = firstInstruction.includes('u-turn') || 
                               firstInstruction.includes('turn around') ||
                               firstInstruction.includes('head back') ||
                               firstInstruction.includes('return');
          
          if (suggestsUTurn && !followTrafficLaws) {
            // When not following traffic laws, provide alternative instructions
            console.log('Suggesting flexible route options...');
            speakInstruction('Recalculando rota. Você pode voltar pela rua que veio ou continuar em frente para encontrar um retorno mais à frente');
          } else if (suggestsUTurn && followTrafficLaws) {
            // When following traffic laws, suggest proper U-turn
            speakInstruction('Recalculando rota. Faça um retorno assim que possível respeitando as leis de trânsito');
          }
          
          // Update the route
          processRouteResult(result);
          setIsOffRoute(false);
          
        } else {
          console.error('Route recalculation failed:', status);
          speakInstruction('Não foi possível recalcular a rota. Continue seguindo as instruções originais');
        }
        
        setRecalculatingRoute(false);
      });
      
    } catch (error) {
      console.error('Error recalculating route:', error);
      setRecalculatingRoute(false);
    }
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, '']);
    waypointRefs.current.push(React.createRef());
    // Clear route when adding waypoint
    if (directions) {
      clearRoute();
    }
  };

  const removeWaypoint = (index) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
    waypointRefs.current.splice(index, 1);
    // Clear route when removing waypoint
    if (directions) {
      clearRoute();
    }
  };

  const updateWaypoint = (index, value) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
    // Clear route when waypoint changes
    if (directions && value !== waypoints[index]) {
      clearRoute();
    }
  };

  // GPS Simulation functions
  const startGPSSimulation = () => {
    if (!navigationSteps.length) return;
    
    console.log('🎮 Starting GPS simulation');
    setIsSimulating(true);
    setSimulationStepIndex(0);
    
    // Start from first step location
    const firstLocation = navigationSteps[0].location;
    setUserLocation(firstLocation);
    
    // Simulate movement along the route
    let currentStepIdx = 0;
    let progress = 0;
    
    const simulationInterval = setInterval(() => {
      if (!isNavigating || currentStepIdx >= navigationSteps.length) {
        clearInterval(simulationInterval);
        setIsSimulating(false);
        return;
      }
      
      const currentStep = navigationSteps[currentStepIdx];
      const nextStep = navigationSteps[currentStepIdx + 1];
      
      if (nextStep) {
        // Interpolate between current and next step
        const lat1 = currentStep.location.lat;
        const lng1 = currentStep.location.lng;
        const lat2 = nextStep.location.lat;
        const lng2 = nextStep.location.lng;
        
        const simulatedLat = lat1 + (lat2 - lat1) * progress;
        const simulatedLng = lng1 + (lng2 - lng1) * progress;
        
        const simulatedLocation = {
          lat: simulatedLat,
          lng: simulatedLng
        };
        
        setUserLocation(simulatedLocation);
        
        // Simulate speed (10-25 km/h for cycling)
        const simSpeed = 15 + Math.random() * 10;
        setCurrentSpeed(Math.round(simSpeed));
        
        // Update progress
        progress += 0.1 * simulationSpeed;
        
        if (progress >= 1) {
          currentStepIdx++;
          progress = 0;
          setSimulationStepIndex(currentStepIdx);
        }
      } else {
        // Reached end
        clearInterval(simulationInterval);
        setIsSimulating(false);
      }
    }, 1000 / simulationSpeed); // Adjust interval based on speed
  };

  const stopGPSSimulation = () => {
    setIsSimulating(false);
    console.log('🛑 GPS simulation stopped');
  };

  const startNavigation = () => {
    if (!navigationSteps.length) {
      alert('Nenhuma rota calculada. Calcule a rota primeiro.');
      return;
    }

    setIsNavigating(true);
    setCurrentStepIndex(0);
    
    // Initialize activity tracking
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);
    setTotalDistance(0);
    setCurrentSpeed(0);
    setCaloriesBurned(0);
    setIsPaused(false);
    
    // Initialize auto-pause tracking
    setIsAutoPaused(false);
    setLastMovementTime(now);
    setLastKnownPosition(null);
    setStationaryStartTime(now);
    
    // Use GPS simulation for development/testing or real GPS
    if (process.env.NODE_ENV === 'development' && isSimulating) {
      console.log('🎮 Using GPS simulation for navigation');
      startGPSSimulation();
    } else if (navigator.geolocation) {
      console.log('📍 Using real GPS for navigation');
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          // Calculate speed from GPS if available
          if (position.coords.speed !== null && position.coords.speed !== undefined) {
            setCurrentSpeed(Math.round(position.coords.speed * 3.6)); // Convert m/s to km/h
          }
          
          // Calculate distance traveled
          if (lastPositionForDistance && !isPaused) {
            const distanceIncrement = calculateDistance(
              lastPositionForDistance.lat,
              lastPositionForDistance.lng,
              newLocation.lat,
              newLocation.lng
            );
            
            // Only add distance if the increment is reasonable (less than 100m per update)
            if (distanceIncrement < 100) {
              setTotalDistance(prev => prev + distanceIncrement);
            }
          }
          
          // Update last position for distance calculation
          if (!isPaused) {
            setLastPositionForDistance(newLocation);
          }
          
          // Check for movement and auto-pause
          checkForMovement(newLocation);
          
          // Update heading if available from GPS
          if (position.coords.heading !== null && position.coords.heading !== undefined && position.coords.heading >= 0) {
            setUserHeading(position.coords.heading);
          } else if (previousLocation) {
            // Calculate heading from movement direction if GPS heading is not available
            const bearing = calculateBearing(
              previousLocation.lat, 
              previousLocation.lng, 
              newLocation.lat, 
              newLocation.lng
            );
            setUserHeading(bearing);
          }
          
          // Store current location as previous for next calculation
          setPreviousLocation(newLocation);
          
          // Check if user reached the next step (only if not paused)
          if (!isPaused) {
            checkNavigationProgress(newLocation);
          }
        },
        (error) => {
          console.error('Error tracking location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    }

    // Speak first instruction
    speakInstruction(navigationSteps[0]);
  };

  const checkNavigationProgress = (userLoc) => {
    if (!navigationSteps.length || currentStepIndex >= navigationSteps.length) return;

    const currentStep = navigationSteps[currentStepIndex];
    const stepLocation = currentStep.location;
    
    // Calculate distance to current step
    const distanceToStep = calculateDistance(userLoc.lat, userLoc.lng, stepLocation.lat, stepLocation.lng);
    setDistanceToNextStep(Math.round(distanceToStep));
    
    // Check if user is significantly off route (more than 100 meters from any upcoming step)
    let isUserOffRoute = true;
    const offRouteThreshold = 100; // meters
    
    // Check distance to next few steps to determine if user is off route
    for (let i = currentStepIndex; i < Math.min(currentStepIndex + 3, navigationSteps.length); i++) {
      const step = navigationSteps[i];
      const distanceToThisStep = calculateDistance(
        userLoc.lat, userLoc.lng, 
        step.location.lat, step.location.lng
      );
      
      if (distanceToThisStep < offRouteThreshold) {
        isUserOffRoute = false;
        break;
      }
    }
    
    // If user is off route and we haven't already started recalculating
    if (isUserOffRoute && !isOffRoute && !recalculatingRoute) {
      console.log('User appears to be off route, triggering recalculation...');
      setIsOffRoute(true);
      setLastKnownRoutePosition(userLoc);
      
      // Get the final destination from the route
      const finalDestination = navigationSteps[navigationSteps.length - 1].location;
      
      // Recalculate route with current traffic law preference
      recalculateRoute(userLoc, finalDestination);
      
      return; // Exit early during recalculation
    }
    
    // Calculate remaining distance and time for entire route
    let totalRemainingDistance = 0;
    let totalRemainingTime = 0;
    
    for (let i = currentStepIndex; i < navigationSteps.length; i++) {
      const step = navigationSteps[i];
      // Extract numeric values from distance and duration strings
      const distanceValue = parseFloat(step.distance.replace(/[^0-9.]/g, '')) || 0;
      const durationValue = parseFloat(step.duration.replace(/[^0-9.]/g, '')) || 0;
      
      totalRemainingDistance += distanceValue;
      totalRemainingTime += durationValue;
    }
    
    setDistanceRemaining(totalRemainingDistance);
    setTimeRemaining(totalRemainingTime);
    
    // Update map center to follow user location with smooth transition
    if (map && userLoc) {
      // Smooth pan to user location (like Waze)
      map.panTo(userLoc);
      
      // Maintain close zoom level for navigation
      if (map.getZoom() !== 19) {
        map.setZoom(19);
      }
      
      // Set map tilt for 3D perspective and align with user heading
      map.setTilt(45);
      
      // Optionally rotate map to match user heading (like some navigation apps)
      // Uncomment the line below if you want the map to rotate with user direction
      // map.setHeading(userHeading || 0);
    }
    
    // If within 50 meters of the step, move to next step
    if (distanceToStep < 50 && currentStepIndex < navigationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      speakInstruction(navigationSteps[nextIndex]);
      
      // Reset off-route state when back on track
      if (isOffRoute) {
        setIsOffRoute(false);
        console.log('User is back on route');
      }
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360; // Normalize to 0-360 degrees
  };

  const speakInstruction = (instructionOrStep) => {
    if ('speechSynthesis' in window) {
      // If it's a step object, use the translated instruction, otherwise translate the string
      const textToSpeak = typeof instructionOrStep === 'object' 
        ? instructionOrStep.translatedInstruction || instructionOrStep.instruction
        : translateInstruction(instructionOrStep, language);
        
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentStepIndex(0);
    setUserLocation(null);
    setUserHeading(0);
    setPreviousLocation(null);
    setDistanceToNextStep(0);
    setTimeRemaining(0);
    setDistanceRemaining(0);
    
    // Reset route recalculation states
    setIsOffRoute(false);
    setRecalculatingRoute(false);
    setLastKnownRoutePosition(null);
    
    // Reset auto-pause states
    setIsAutoPaused(false);
    setLastMovementTime(null);
    setLastKnownPosition(null);
    setStationaryStartTime(null);
    
    window.speechSynthesis.cancel();
  };

  const toggleBikeLayer = () => {
    console.log('Toggle clicked. Current state:', { 
      showBikeLayer, 
      map: !!map, 
      bikeLayer: !!bikeLayer
    });
    
    if (!map) {
      console.log('No map available');
      return;
    }
    
    const newShowState = !showBikeLayer;
    console.log('Changing showBikeLayer from', showBikeLayer, 'to', newShowState);
    
    if (newShowState) {
      // Show bicycle layer and restore normal map styling
      if (!bikeLayer) {
        console.log('Creating new bicycle layer');
        const newBikeLayer = new window.google.maps.BicyclingLayer();
        setBikeLayer(newBikeLayer);
        newBikeLayer.setMap(map);
      } else {
        console.log('Showing existing bicycle layer');
        bikeLayer.setMap(map);
      }
      
      // Reset map styles to show bicycle features
      map.setOptions({ styles: [] });
      setShowBikeLayer(true);
      console.log('Bicycle layer shown and styles reset');
    } else {
      // Hide bicycle layer and apply hiding styles
      if (bikeLayer) {
        console.log('Hiding bicycle layer');
        bikeLayer.setMap(null);
      }
      
      // Apply styles to hide bicycle features
      const hideBicycleStyles = [
        {
          featureType: 'road.bicycle',
          stylers: [{ visibility: 'off' }]
        }
      ];
      map.setOptions({ styles: hideBicycleStyles });
      setShowBikeLayer(false);
      console.log('Bicycle layer hidden and styles applied');
    }
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    } else {
      return `${mins}min`;
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Retranslate existing navigation steps
    if (navigationSteps.length > 0) {
      const updatedSteps = navigationSteps.map(step => ({
        ...step,
        translatedInstruction: translateInstruction(step.instruction, newLanguage)
      }));
      setNavigationSteps(updatedSteps);
    }
  };

  const handlePreferenceChange = (setter, value) => {
    // Clear current route when preferences change so user needs to recalculate
    if (directions) {
      clearRoute();
    }
    // Set the new preference value immediately
    setter(value);
  };

  // Activity tracking functions
  const calculateCalories = (distance, time) => {
    // Cycling calories calculation: ~30-50 calories per km depending on intensity
    // Average cyclist: 40 calories per km
    const caloriesPerKm = 40;
    return Math.round(distance * caloriesPerKm);
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pauseActivity = () => {
    setIsPaused(true);
    setIsAutoPaused(false); // Manual pause overrides auto-pause
    console.log('Activity manually paused');
  };

  const resumeActivity = () => {
    setIsPaused(false);
    setIsAutoPaused(false);
    
    // Reset movement tracking when manually resuming
    if (userLocation) {
      setLastKnownPosition(userLocation);
      setLastMovementTime(Date.now());
      setStationaryStartTime(Date.now());
    }
    
    console.log('Activity manually resumed');
  };

  const stopActivity = () => {
    setIsNavigating(false);
    setIsPaused(false);
    setIsAutoPaused(false);
    setStartTime(null);
    setElapsedTime(0);
    setTotalDistance(0);
    setCurrentSpeed(0);
    setCaloriesBurned(0);
    setLastPositionForDistance(null);
    setLastMovementTime(null);
    setLastKnownPosition(null);
    setStationaryStartTime(null);
    stopNavigation();
    console.log('Activity stopped');
  };

  // Auto-pause functions
  const checkForMovement = (currentLocation) => {
    const now = Date.now();
    const movementThreshold = 5; // meters - minimum distance to consider as movement
    
    if (!lastKnownPosition) {
      // First position recorded
      setLastKnownPosition(currentLocation);
      setLastMovementTime(now);
      setStationaryStartTime(now);
      return;
    }
    
    // Calculate distance from last known position
    const distanceMoved = calculateDistance(
      lastKnownPosition.lat,
      lastKnownPosition.lng,
      currentLocation.lat,
      currentLocation.lng
    );
    
    if (distanceMoved > movementThreshold) {
      // User is moving
      setLastKnownPosition(currentLocation);
      setLastMovementTime(now);
      setStationaryStartTime(now);
      
      // If was auto-paused, resume activity
      if (isAutoPaused) {
        console.log('Movement detected - resuming from auto-pause');
        setIsAutoPaused(false);
        setIsPaused(false);
        speakInstruction('Retomando pedalada');
      }
    } else {
      // User is stationary
      if (!stationaryStartTime) {
        setStationaryStartTime(now);
      }
      
      const stationaryTime = now - stationaryStartTime;
      const autoPauseThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      // Check if user has been stationary for more than 10 minutes
      if (stationaryTime > autoPauseThreshold && !isAutoPaused && !isPaused) {
        console.log('Auto-pausing due to inactivity for 10+ minutes');
        setIsAutoPaused(true);
        setIsPaused(true);
        speakInstruction('Atividade pausada por inatividade');
      }
    }
  };

  if (loadError) {
    console.error('🚨 Google Maps Load Error:', loadError);
    return (
      <Container>
        <Sidebar>
          <Title>🗺️ Google Maps Error</Title>
          <div style={{ color: '#e74c3c', padding: '1rem', background: '#fdf2f2', borderRadius: '8px' }}>
            <p><strong>❌ Maps couldn't load.</strong></p>
            <p><strong>Error:</strong> {loadError?.message || loadError?.toString() || 'Unknown error'}</p>
            <p><strong>API Key Status:</strong> {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>API Key (first 20 chars):</strong> {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY.substring(0, 20) + '...' : 'N/A'}</p>
            
            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Troubleshooting:</h4>
            <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li>Check your Google Maps API key in <code>.env</code> file</li>
              <li>Verify the following APIs are enabled in Google Cloud Console:
                <ul style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <li>Maps JavaScript API</li>
                  <li>Directions API</li>
                  <li>Places API</li>
                  <li>Elevation API</li>
                  <li>Geocoding API</li>
                </ul>
              </li>
              <li>Check API key restrictions and billing</li>
              <li>Restart the development server after changes</li>
            </ol>
            
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                🔗 Open Google Cloud Console
              </a>
            </p>
          </div>
        </Sidebar>
        <MapContainer style={{ background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <div>Map will appear here once the issue is resolved</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Check the sidebar for detailed error information
            </div>
          </div>
        </MapContainer>
      </Container>
    );
  }

  if (!isLoaded) {
    return (
      <Container>
        <Sidebar>
          <Title>Carregando Mapa...</Title>
          <div style={{ padding: '1rem', background: '#e8f4f8', borderRadius: '8px', marginBottom: '1rem' }}>
            <p>🔄 Carregando Google Maps...</p>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
              Se demorar muito, pode ser problema com a API key
            </p>
          </div>
        </Sidebar>
        <MapContainer style={{ background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗺️</div>
            <div>Carregando Google Maps...</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Aguarde alguns segundos
            </div>
          </div>
        </MapContainer>
      </Container>
    );
  }

  // Dynamic Navigation View (like Waze)
  if (isNavigating && navigationSteps.length > 0) {
    const currentStep = navigationSteps[currentStepIndex];
    const nextStep = navigationSteps[currentStepIndex + 1];
    
    return (
      <NavigationView>
        <DynamicNavigationHeader>
          <NavigationInfo>
            <NextInstruction>
              {currentStep?.translatedInstruction || currentStep?.instruction || 'Navegando...'}
            </NextInstruction>
            <DistanceToStep>
              {distanceToNextStep > 0 && formatDistance(distanceToNextStep)}
            </DistanceToStep>
          </NavigationInfo>
          <ExitNavigationButton onClick={stopNavigation}>
            ✕ Sair
          </ExitNavigationButton>
        </DynamicNavigationHeader>

        <NavigationMap>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={userLocation || currentLocationCoords || center}
            zoom={19}
            onLoad={(mapInstance) => {
              setMap(mapInstance);
              
              // Set initial navigation view settings
              mapInstance.setTilt(45);
              
              // Don't show bike layers during navigation unless explicitly enabled
              if (bikeLayer) {
                bikeLayer.setMap(null);
              }
            }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling: 'greedy',
              tilt: 45,
              styles: [
                {
                  featureType: 'poi.business',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'poi.school',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'poi.medical',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'poi.attraction',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'transit',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'road',
                  elementType: 'labels.icon',
                  stylers: [{ visibility: 'off' }]
                },
                {
                  featureType: 'administrative',
                  elementType: 'labels',
                  stylers: [{ visibility: 'simplified' }]
                }
              ]
            }}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: false,
                  suppressInfoWindows: true,
                  polylineOptions: {
                    strokeColor: '#3498db',
                    strokeWeight: 6,
                    strokeOpacity: 0.9
                  }
                }}
              />
            )}
            
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
                      <!-- Outer shadow/glow -->
                      <circle cx="22" cy="22" r="20" fill="rgba(0, 0, 0, 0.2)" stroke="none"/>
                      <!-- Accuracy circle -->
                      <circle cx="22" cy="22" r="18" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.3)" stroke-width="1"/>
                      <!-- Main navigation circle -->
                      <circle cx="22" cy="22" r="15" fill="#1976D2" stroke="#ffffff" stroke-width="4"/>
                      <!-- Direction arrow - rotated based on heading -->
                      <g transform="rotate(${userHeading || 0} 22 22)">
                        <path d="M22 9 L29 22 L22 19 L15 22 Z" fill="#ffffff" stroke="none"/>
                        <path d="M22 9 L24 14 L22 13 L20 14 Z" fill="#E3F2FD" stroke="none"/>
                      </g>
                      <!-- Center pulse dot -->
                      <circle cx="22" cy="22" r="2.5" fill="#ffffff">
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(44, 44),
                  anchor: new window.google.maps.Point(22, 22)
                }}
                title="Sua localização - Navegando"
              />
            )}
          </GoogleMap>

          {/* Next Step Preview */}
          {nextStep && (
            <NextStepPreview>
              <NextStepTitle>PRÓXIMO</NextStepTitle>
              <NextStepInstruction>
                {nextStep.translatedInstruction || nextStep.instruction}
              </NextStepInstruction>
              <NextStepDistance>
                {nextStep.distance}
              </NextStepDistance>
            </NextStepPreview>
          )}

          {/* Route Progress */}
          <RouteProgress>
            <ProgressItem>
              <ProgressValue>{formatTime(timeRemaining)}</ProgressValue>
              <ProgressLabel>TEMPO</ProgressLabel>
            </ProgressItem>
            <ProgressItem>
              <ProgressValue>{formatDistance(distanceRemaining * 1000)}</ProgressValue>
              <ProgressLabel>DISTÂNCIA</ProgressLabel>
            </ProgressItem>
            <ProgressItem>
              <ProgressValue>{currentStepIndex + 1}/{navigationSteps.length}</ProgressValue>
              <ProgressLabel>ETAPAS</ProgressLabel>
            </ProgressItem>
          </RouteProgress>
        </NavigationMap>

        {/* Activity Tracking Panel */}
        <ActivityPanel>
          <ActivityHeader>
            {isAutoPaused ? '⏸️ Auto-Pausado' : isPaused ? '⏸️ Pausado' : '🚴‍♂️ Pedalando'}
          </ActivityHeader>
          
          <MetricsGrid>
            <MetricCard>
              <MetricValue>
                {formatElapsedTime(elapsedTime)}
              </MetricValue>
              <MetricLabel>TIME</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>
                {(totalDistance / 1000).toFixed(1)}
              </MetricValue>
              <MetricLabel>DISTANCE (KM)</MetricLabel>
            </MetricCard>
          </MetricsGrid>

          <SecondaryMetricsGrid>
            <SecondaryMetric>
              <SecondaryValue>
                {elapsedTime > 0 ? ((totalDistance / 1000) / (elapsedTime / 3600)).toFixed(1) : '0.0'}
              </SecondaryValue>
              <SecondaryLabel>AVG SPEED KM/H</SecondaryLabel>
            </SecondaryMetric>
            
            <SecondaryMetric>
              <SecondaryValue>{caloriesBurned}</SecondaryValue>
              <SecondaryLabel>CALORIES</SecondaryLabel>
            </SecondaryMetric>
          </SecondaryMetricsGrid>

          <ControlButtons>
            <ControlButton 
              className="play-pause" 
              isPaused={isPaused}
              onClick={isPaused ? resumeActivity : pauseActivity}
              title={isPaused ? 'Retomar' : 'Pausar'}
            >
              {isPaused ? <FiPlay /> : <FiPause />}
            </ControlButton>
            
            <ControlButton 
              className="stop" 
              onClick={stopActivity}
              title="Parar atividade"
            >
              <FiSquare />
            </ControlButton>
            
            <ControlButton 
              className="location" 
              onClick={() => map && userLocation && map.panTo(userLocation)}
              title="Centralizar no mapa"
            >
              <FiTarget />
            </ControlButton>
          </ControlButtons>
        </ActivityPanel>
      </NavigationView>
    );
  }

  return (
    <>

      <Container>
        <Sidebar ref={sidebarRef}>
        <Title>Planejar Rota</Title>
        
        {showRouteChangedNotice && (
          <RouteChangedNotice>
            ⚠️ Rota anterior removida. Calcule nova rota.
          </RouteChangedNotice>
        )}

        {recalculatingRoute && (
          <RecalculatingNotice>
            🔄 Recalculando rota...
          </RecalculatingNotice>
        )}

        {isOffRoute && !recalculatingRoute && (
          <OffRouteNotice>
            📍 Você saiu da rota planejada
          </OffRouteNotice>
        )}

        <LanguageSelector>
          <LanguageLabel>🗣️ Idioma das Instruções</LanguageLabel>
          <LanguageSelect 
            value={language} 
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="en-US">🇺🇸 English (US)</option>
          </LanguageSelect>
        </LanguageSelector>

        <PreferencesSection>
          <PreferencesTitle>🚴‍♂️ Preferências de Rota</PreferencesTitle>
          
          <PreferenceOption>
            <PreferenceLabel onClick={() => handlePreferenceChange(setPreferBikeLanes, !preferBikeLanes)}>
              <div>
                <div>🛣️ Priorizar Ciclofaixas</div>
                <PreferenceDescription>
                  Utilizar ciclofaixas sempre que possível
                </PreferenceDescription>
              </div>
            </PreferenceLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ToggleSwitch 
                active={preferBikeLanes} 
                onClick={() => handlePreferenceChange(setPreferBikeLanes, !preferBikeLanes)}
              />
              <ToggleLabel active={preferBikeLanes}>
                {preferBikeLanes ? 'Sim' : 'Não'}
              </ToggleLabel>
            </div>
          </PreferenceOption>

          <PreferenceOption>
            <PreferenceLabel onClick={() => handlePreferenceChange(setAvoidHighways, !avoidHighways)}>
              <div>
                <div>🛣️ Evitar Estradas e Rodovias</div>
                <PreferenceDescription>
                  Fugir ao máximo de estradas e rodovias
                </PreferenceDescription>
              </div>
            </PreferenceLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ToggleSwitch 
                active={avoidHighways} 
                onClick={() => handlePreferenceChange(setAvoidHighways, !avoidHighways)}
              />
              <ToggleLabel active={avoidHighways}>
                {avoidHighways ? 'Sim' : 'Não'}
              </ToggleLabel>
            </div>
          </PreferenceOption>

          <PreferenceOption>
            <PreferenceLabel onClick={() => handlePreferenceChange(setAvoidExpressways, !avoidExpressways)}>
              <div>
                <div>🚗 Evitar Vias Expressas</div>
                <PreferenceDescription>
                  Evitar ao máximo passar por vias expressas
                </PreferenceDescription>
              </div>
            </PreferenceLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ToggleSwitch 
                active={avoidExpressways} 
                onClick={() => handlePreferenceChange(setAvoidExpressways, !avoidExpressways)}
              />
              <ToggleLabel active={avoidExpressways}>
                {avoidExpressways ? 'Sim' : 'Não'}
              </ToggleLabel>
            </div>
          </PreferenceOption>

          <PreferenceOption>
            <PreferenceLabel onClick={() => handlePreferenceChange(setFollowTrafficLaws, !followTrafficLaws)}>
              <div>
                <div>⚖️ Seguir Leis de Trânsito</div>
                <PreferenceDescription>
                  Se NÃO: permite contra-mão e retornos diretos para ganhar tempo. Útil para recálculos quando você erra o caminho
                </PreferenceDescription>
              </div>
            </PreferenceLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ToggleSwitch 
                active={followTrafficLaws} 
                onClick={() => handlePreferenceChange(setFollowTrafficLaws, !followTrafficLaws)}
              />
              <ToggleLabel active={followTrafficLaws}>
                {followTrafficLaws ? 'Sim' : 'Não'}
              </ToggleLabel>
            </div>
          </PreferenceOption>
        </PreferencesSection>
        
        <InputGroup>
          <Label>
            <FiMapPin /> Ponto de Partida
          </Label>
          {isLoaded && !loadError ? (
            <Autocomplete
              onLoad={(autocomplete) => originRef.current = autocomplete}
              onPlaceChanged={() => {
                if (originRef.current) {
                  const place = originRef.current.getPlace();
                  if (place && place.formatted_address) {
                    handleOriginChange(place.formatted_address);
                  } else {
                    console.log('No valid place selected for origin');
                  }
                }
              }}
            >
              <Input
                type="text"
                placeholder={locationLoading ? "Obtendo localização..." : "Ponto de partida"}
                value={origin}
                onChange={(e) => handleOriginChange(e.target.value)}
                disabled={locationLoading}
              />
            </Autocomplete>
          ) : (
            <Input
              type="text"
              placeholder={locationLoading ? "Obtendo localização..." : "Digite o ponto de partida"}
              value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              disabled={locationLoading}
            />
          )}
          
          {isUsingCurrentLocation ? (
            <LocationStatus>
              📍 Usando sua localização atual
              {!locationLoading && (
                <LocationButton onClick={() => setIsUsingCurrentLocation(false)}>
                  Alterar
                </LocationButton>
              )}
            </LocationStatus>
          ) : (
            <LocationStatus>
              <LocationButton 
                onClick={useCurrentLocationAgain}
                disabled={locationLoading}
              >
                📍 Usar minha localização atual
              </LocationButton>
            </LocationStatus>
          )}
        </InputGroup>

        <InputGroup>
          <Label>
            <FiNavigation /> Destino
          </Label>
          {isLoaded && !loadError ? (
            <Autocomplete
              onLoad={(autocomplete) => destinationRef.current = autocomplete}
              onPlaceChanged={() => {
                if (destinationRef.current) {
                  const place = destinationRef.current.getPlace();
                  if (place && place.formatted_address) {
                    handleDestinationChange(place.formatted_address);
                  } else {
                    console.log('No valid place selected for destination');
                  }
                }
              }}
            >
              <Input
                type="text"
                placeholder="Digite o destino"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
              />
            </Autocomplete>
          ) : (
            <Input
              type="text"
              placeholder="Digite o destino"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
            />
          )}
        </InputGroup>

        {waypoints.map((waypoint, index) => (
          <WaypointContainer key={index}>
            <div style={{ flex: 1 }}>
              {isLoaded && !loadError ? (
                <Autocomplete
                  onLoad={(autocomplete) => waypointRefs.current[index] = autocomplete}
                  onPlaceChanged={() => {
                    if (waypointRefs.current[index]) {
                      const place = waypointRefs.current[index].getPlace();
                      if (place && place.formatted_address) {
                        updateWaypoint(index, place.formatted_address);
                      } else {
                        console.log(`No valid place selected for waypoint ${index + 1}`);
                      }
                    }
                  }}
                >
                  <Input
                    type="text"
                    placeholder={`Waypoint ${index + 1}`}
                    value={waypoint}
                    onChange={(e) => updateWaypoint(index, e.target.value)}
                  />
                </Autocomplete>
              ) : (
                <Input
                  type="text"
                  placeholder={`Waypoint ${index + 1} (API key required for autocomplete)`}
                  value={waypoint}
                  onChange={(e) => updateWaypoint(index, e.target.value)}
                />
              )}
            </div>
            <RemoveButton onClick={() => removeWaypoint(index)}>
              <FiTrash2 />
            </RemoveButton>
          </WaypointContainer>
        ))}

        <AddWaypointButton onClick={addWaypoint}>
          <FiPlus /> Adicionar Parada
        </AddWaypointButton>

        <StartButton 
          onClick={calculateRoute} 
          disabled={!origin || !destination || (!isLoaded || loadError)}
        >
          {(!isLoaded || loadError) ? 'Precisa da API Key do Google Maps' : 'Calcular Rota'}
        </StartButton>

        {routeInfo && (
          <>
            <RouteInfo data-route-info>
              <InfoItem>
                <span>Distance:</span>
                <strong>{routeInfo.distance.toFixed(1)} km</strong>
              </InfoItem>
              <InfoItem>
                <span>Duration:</span>
                <strong>{Math.round(routeInfo.duration)} min</strong>
              </InfoItem>
              <InfoItem>
                <span>CO₂ Saved:</span>
                <strong>{routeInfo.co2Saved.toFixed(2)} kg</strong>
              </InfoItem>
              
              {/* Show applied preferences */}
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#7f8c8d' }}>
                <div><strong>Preferências aplicadas:</strong></div>
                {preferBikeLanes && <div>✅ Priorizando ciclofaixas</div>}
                {avoidHighways && <div>✅ Evitando estradas/rodovias</div>}
                {avoidExpressways && <div>✅ Evitando vias expressas</div>}
                {followTrafficLaws && <div>✅ Seguindo leis de trânsito</div>}
              </div>

              {routeInfo.elevationGain !== undefined && (
                <ElevationInfo>
                  <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>🏔️ Perfil de Elevação</div>
                  <InfoItem style={{ color: 'white', marginBottom: '0.5rem' }}>
                    <span>Ganho de Elevação:</span>
                    <strong>{routeInfo.elevationGain} m</strong>
                  </InfoItem>
                  <InfoItem style={{ color: 'white', marginBottom: '0.5rem' }}>
                    <span>Elevação Máxima:</span>
                    <strong>{routeInfo.maxElevation} m</strong>
                  </InfoItem>
                  <DifficultyBadge color={routeInfo.difficultyColor}>
                    {routeInfo.difficulty === 'Fácil' && '😊'}
                    {routeInfo.difficulty === 'Moderado' && '😅'}
                    {routeInfo.difficulty === 'Difícil' && '😰'}
                    {routeInfo.difficulty === 'Muito Difícil' && '🥵'}
                    {routeInfo.difficulty}
                  </DifficultyBadge>
                </ElevationInfo>
              )}
            </RouteInfo>

            {/* Botão de ciclovias logo após calcular rota */}
            <ToggleButton 
              onClick={toggleBikeLayer} 
              active={showBikeLayer}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              {showBikeLayer ? '🚫 Esconder Ciclovias' : '🚴‍♂️ Mostrar Ciclovias'}
            </ToggleButton>
          </>
        )}

        {directions && !isNavigating && (
          <>
            <StartButton onClick={startNavigation}>
              <FiPlay /> Iniciar Navegação
            </StartButton>
            
            {/* GPS Simulation Controls (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: '#e8f4f8', 
                borderRadius: '8px',
                border: '2px solid #3498db'
              }}>
                <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  🧪 Modo de Teste (Development)
                </h4>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#2c3e50'
                  }}>
                    <input
                      type="checkbox"
                      checked={isSimulating}
                      onChange={(e) => setIsSimulating(e.target.checked)}
                    />
                    Simular GPS (teste sem sair de casa)
                  </label>
                </div>
                
                {isSimulating && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <label style={{ 
                      fontSize: '0.8rem', 
                      color: '#2c3e50',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Velocidade da simulação: {simulationSpeed}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={simulationSpeed}
                      onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
                
                <div style={{ fontSize: '0.7rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                  💡 Com GPS simulado, você pode testar a navegação sem se mover
                </div>
              </div>
            )}
          </>
        )}
        
        {isNavigating && (
          <StartButton onClick={stopNavigation} style={{ background: '#e74c3c' }}>
            🛑 Parar Navegação
          </StartButton>
        )}
      </Sidebar>

      <MapContainer>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentLocationCoords || center}
          zoom={currentLocationCoords ? 15 : 12}
          onLoad={(mapInstance) => {
            console.log('🗺️ Map instance loaded successfully!');
            setMap(mapInstance);
            
            // Simple bicycle layer setup
            const bicyclingLayer = new window.google.maps.BicyclingLayer();
            setBikeLayer(bicyclingLayer);
            console.log('✅ Bicycle layer created (hidden by default)');
          }}
          onError={(error) => {
            console.error('🚨 Google Map Error:', error);
          }}
          onUnmount={() => {
            console.log('🗺️ Map unmounted');
            setMap(null);
          }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            mapTypeControlOptions: {
              style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR,
              position: window.google?.maps?.ControlPosition?.TOP_CENTER,
              mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
            },
            styles: null // Ensure no custom styling that might hide roads
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                suppressInfoWindows: true,
                polylineOptions: {
                  strokeColor: '#3498db',
                  strokeWeight: 4,
                  strokeOpacity: 0.8
                }
              }}
            />
          )}
          
          {isNavigating && userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#27ae60">
                    <circle cx="12" cy="12" r="8" stroke="#fff" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(20, 20),
              }}
              title="Sua localização atual"
            />
          )}
        </GoogleMap>
      </MapContainer>
    </Container>
    </>
  );
};

export default NewRoute;