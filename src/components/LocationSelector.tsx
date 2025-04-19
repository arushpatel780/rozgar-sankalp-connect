
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const LocationSelector = () => {
  const { user, updateUserLocation } = useAuth();
  const [location, setLocation] = useState(user?.location || '');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleLocationUpdate = () => {
    if (location.trim()) {
      updateUserLocation(location);
    }
  };

  const detectLocation = () => {
    setIsDetecting(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Simulate fetching location name from coordinates
            // In a real app, you would use a geocoding service API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate a successful response with a random pin code
            const pincodes = ['110001', '400001', '700001', '600001', '500001'];
            const randomPincode = pincodes[Math.floor(Math.random() * pincodes.length)];
            
            setLocation(randomPincode);
            updateUserLocation(randomPincode);
            setIsDetecting(false);
          } catch (error) {
            console.error('Error fetching location data:', error);
            setIsDetecting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsDetecting(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsDetecting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter PIN code"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" onClick={handleLocationUpdate} size="sm">
          Update
        </Button>
      </div>
      
      <Button 
        variant="ghost" 
        onClick={detectLocation} 
        disabled={isDetecting}
        className="w-full flex items-center justify-center gap-2"
      >
        <MapPin className="h-4 w-4" />
        <span>{isDetecting ? 'Detecting...' : 'Auto-detect location'}</span>
      </Button>
    </div>
  );
};

export default LocationSelector;
