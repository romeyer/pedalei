// Strava API Integration
// In production, you'll need to register your app at https://strava.com/settings/api

const STRAVA_CONFIG = {
  clientId: process.env.REACT_APP_STRAVA_CLIENT_ID || 'YOUR_CLIENT_ID',
  clientSecret: process.env.REACT_APP_STRAVA_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
  redirectUri: `${window.location.origin}/strava-callback`,
  scope: 'read,activity:read_all'
};

class StravaService {
  
  // Step 1: Get authorization URL
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: STRAVA_CONFIG.clientId,
      response_type: 'code',
      redirect_uri: STRAVA_CONFIG.redirectUri,
      approval_prompt: 'force',
      scope: STRAVA_CONFIG.scope
    });

    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }

  // Step 2: Exchange authorization code for access token
  async exchangeToken(code) {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: STRAVA_CONFIG.clientId,
          client_secret: STRAVA_CONFIG.clientSecret,
          code: code,
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange token');
      }

      const tokenData = await response.json();
      
      // Store token and athlete info
      localStorage.setItem('strava_token', JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at,
        athlete: tokenData.athlete
      }));

      return tokenData;
    } catch (error) {
      console.error('Error exchanging Strava token:', error);
      throw error;
    }
  }

  // Get stored token
  getStoredToken() {
    const stored = localStorage.getItem('strava_token');
    return stored ? JSON.parse(stored) : null;
  }

  // Check if user is connected to Strava
  isConnected() {
    const token = this.getStoredToken();
    return token && token.access_token && Date.now() < (token.expires_at * 1000);
  }

  // Get athlete's activities
  async getActivities(limit = 30) {
    try {
      const token = this.getStoredToken();
      if (!token || !token.access_token) {
        throw new Error('No Strava token available');
      }

      // Check if token is expired
      if (Date.now() >= (token.expires_at * 1000)) {
        await this.refreshToken();
      }

      const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const activities = await response.json();
      
      // Filter only cycling activities
      const cyclingActivities = activities.filter(activity => 
        activity.sport_type === 'Ride' || activity.type === 'Ride'
      );

      return this.processActivities(cyclingActivities);
    } catch (error) {
      console.error('Error fetching Strava activities:', error);
      throw error;
    }
  }

  // Process activities to match our format
  processActivities(activities) {
    return activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      distance: (activity.distance / 1000).toFixed(1), // Convert to km
      duration: Math.round(activity.moving_time / 60), // Convert to minutes
      elevationGain: activity.total_elevation_gain,
      averageSpeed: (activity.average_speed * 3.6).toFixed(1), // Convert m/s to km/h
      maxSpeed: (activity.max_speed * 3.6).toFixed(1),
      date: new Date(activity.start_date).toLocaleDateString('pt-BR'),
      kudos: activity.kudos_count,
      polyline: activity.map?.summary_polyline,
      startCoords: activity.start_latlng,
      endCoords: activity.end_latlng,
      calories: activity.calories || this.estimateCalories(activity.distance, activity.moving_time),
      co2Saved: (activity.distance / 1000 * 0.21).toFixed(2), // Same calculation as our app
      source: 'strava'
    }));
  }

  // Estimate calories if not provided by Strava
  estimateCalories(distanceMeters, timeSeconds) {
    const distanceKm = distanceMeters / 1000;
    const timeHours = timeSeconds / 3600;
    const avgSpeed = distanceKm / timeHours;
    
    // Basic calorie estimation for cycling
    let caloriesPerHour = 300; // Base rate
    
    if (avgSpeed > 25) caloriesPerHour = 600;
    else if (avgSpeed > 20) caloriesPerHour = 500;
    else if (avgSpeed > 15) caloriesPerHour = 400;
    
    return Math.round(caloriesPerHour * timeHours);
  }

  // Refresh expired token
  async refreshToken() {
    try {
      const token = this.getStoredToken();
      if (!token || !token.refresh_token) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: STRAVA_CONFIG.clientId,
          client_secret: STRAVA_CONFIG.clientSecret,
          refresh_token: token.refresh_token,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const newTokenData = await response.json();
      
      const updatedToken = {
        ...token,
        access_token: newTokenData.access_token,
        refresh_token: newTokenData.refresh_token,
        expires_at: newTokenData.expires_at
      };

      localStorage.setItem('strava_token', JSON.stringify(updatedToken));
      return updatedToken;
    } catch (error) {
      console.error('Error refreshing Strava token:', error);
      // Clear invalid token
      localStorage.removeItem('strava_token');
      throw error;
    }
  }

  // Disconnect from Strava
  disconnect() {
    localStorage.removeItem('strava_token');
  }

  // Get athlete info
  async getAthlete() {
    try {
      const token = this.getStoredToken();
      if (!token || !token.access_token) {
        throw new Error('No Strava token available');
      }

      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: {
          'Authorization': `Bearer ${token.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch athlete data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching athlete data:', error);
      throw error;
    }
  }
}

export default new StravaService();