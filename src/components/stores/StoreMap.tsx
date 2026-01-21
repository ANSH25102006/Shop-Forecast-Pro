import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStores, Store } from "@/services/storeService";
import { MapPin, Phone, Mail, Store as StoreIcon, CheckCircle, Clock, TrendingUp, Package, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface StoreWithDistance extends Store {
  distance?: number;
}

const StoreMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const { data: stores, isLoading, error } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  const [locationCity, setLocationCity] = useState<string>("Detecting...");

  // Get user's location with high accuracy
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          // Reverse geocode to get city name (simplified)
          setLocationCity(`${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`);
        },
        () => {
          // Default to Mumbai if geolocation fails
          setUserLocation([19.076, 72.8777]);
          setLocationCity("Mumbai (default)");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setUserLocation([19.076, 72.8777]);
      setLocationCity("Mumbai (default)");
    }
  }, []);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Sort stores by distance
  const storesWithDistance = useMemo(() => {
    if (!stores || !userLocation) return [];
    
    return stores
      .filter((store) => store.latitude && store.longitude)
      .map((store) => ({
        ...store,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
          store.latitude!,
          store.longitude!
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [stores, userLocation]);

  if (isLoading || !userLocation) {
    return (
      <div className="rounded-xl overflow-hidden border border-border/50">
        <Skeleton className="w-full h-[500px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/10 p-6 text-center h-[500px] flex items-center justify-center">
        <p className="text-destructive">Failed to load map. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 shadow-card">
      {/* Interactive Map Display */}
      <div className="relative h-[400px] bg-muted">
        {/* Map Background with Grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Center crosshair for user location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary animate-ping absolute inset-0 opacity-25" />
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-elevated relative border-2 border-card">
              <Navigation className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
            <p className="text-xs font-medium text-foreground bg-card px-2 py-1 rounded-lg shadow-card">
              📍 {locationCity}
            </p>
          </div>
        </div>

        {/* Store markers positioned around the center */}
        {storesWithDistance.slice(0, 8).map((store, index) => {
          const angle = (index / Math.min(storesWithDistance.length, 8)) * 2 * Math.PI;
          const radius = 30 + (store.distance || 0) * 15; // Distance affects radius
          const x = 50 + Math.cos(angle) * Math.min(radius, 40);
          const y = 50 + Math.sin(angle) * Math.min(radius, 35);
          
          return (
            <button
              key={store.id}
              className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                selectedStore?.id === store.id ? 'scale-125 z-30' : ''
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-card ${
                  store.is_verified ? 'gradient-primary' : 'bg-chart-4'
                }`}
              >
                <StoreIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-medium text-foreground bg-card px-1 rounded shadow">
                  {(store.distance || 0).toFixed(1)} km
                </span>
              </div>
            </button>
          );
        })}

        {/* Selected store popup */}
        {selectedStore && (
          <div className="absolute bottom-4 left-4 right-4 z-40 animate-fade-in">
            <StorePopupContent 
              store={selectedStore} 
              onClose={() => setSelectedStore(null)} 
            />
          </div>
        )}

        {/* Map controls hint */}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-card">
          <p className="text-xs text-muted-foreground">
            Click on a store marker to view details
          </p>
        </div>
      </div>

      {/* Store List Below Map */}
      <div className="p-4 border-t border-border/50 max-h-[200px] overflow-y-auto">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Nearby Stores ({storesWithDistance.length} found)
        </h4>
        <div className="space-y-2">
          {storesWithDistance.length > 0 ? (
            storesWithDistance.map((store) => (
              <button
                key={store.id}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedStore?.id === store.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      store.is_verified ? 'gradient-primary' : 'bg-chart-4'
                    }`}>
                      <StoreIcon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{store.store_name}</p>
                      <p className="text-xs text-muted-foreground">{store.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{(store.distance || 0).toFixed(1)} km</p>
                    {store.is_verified && (
                      <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/20">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No stores found nearby. Be the first to register!
            </p>
          )}
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="bg-card p-4 border-t border-border/50">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full gradient-primary" />
            <span className="text-muted-foreground">Verified Store</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-chart-4" />
            <span className="text-muted-foreground">Pending Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Popup content component
const StorePopupContent = ({ store, onClose }: { store: Store; onClose: () => void }) => {
  // Mock sales data - in production this would come from the database
  const mockSales = useMemo(() => ({
    monthlySales: `₹${Math.floor(Math.random() * 50000 + 20000).toLocaleString()}`,
    productsCount: Math.floor(Math.random() * 200 + 50),
    trend: `+${(Math.random() * 20 + 5).toFixed(1)}%`,
  }), [store.id]);

  return (
    <div className="bg-card rounded-xl shadow-elevated border border-border/50 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary flex-shrink-0">
            <StoreIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-base">{store.store_name}</h4>
            {store.is_verified ? (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          ✕
        </Button>
      </div>

      {/* Owner Info */}
      <div className="bg-muted/50 rounded-lg p-3 mb-3">
        <p className="text-sm font-medium text-foreground mb-2">Owner Details</p>
        <p className="text-sm text-muted-foreground mb-1">
          <strong className="text-foreground">Name:</strong> {store.owner_name}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <Phone className="h-3 w-3" />
          <span>+91 {store.phone_number}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span>{store.email}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p>{store.address}</p>
          <p>{store.city}, {store.pincode}</p>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="border-t border-border/50 pt-3">
        <p className="text-sm font-medium text-foreground mb-2">Store Performance</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Monthly Sales</p>
            <p className="text-sm font-bold text-foreground">{mockSales.monthlySales}</p>
          </div>
          <div className="text-center p-2 bg-accent/10 rounded-lg">
            <Package className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Products</p>
            <p className="text-sm font-bold text-foreground">{mockSales.productsCount}</p>
          </div>
          <div className="text-center p-2 bg-chart-3/10 rounded-lg">
            <TrendingUp className="h-4 w-4 text-chart-3 mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Growth</p>
            <p className="text-sm font-bold text-chart-3">{mockSales.trend}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;
