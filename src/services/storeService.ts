import { supabase } from "@/integrations/supabase/client";

export interface Store {
  id: string;
  owner_name: string;
  store_name: string;
  aadhaar_number: string;
  pan_number: string | null;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  store_type: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreRegistration {
  owner_name: string;
  store_name: string;
  aadhaar_number: string;
  pan_number?: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  store_type?: string;
}

export const registerStore = async (data: StoreRegistration): Promise<Store> => {
  const { data: store, error } = await supabase
    .from('stores')
    .insert([data])
    .select()
    .single();
  
  if (error) throw error;
  return store;
};

export const fetchStores = async (): Promise<Store[]> => {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const fetchNearbyStores = async (
  lat: number, 
  lng: number, 
  radiusKm: number = 5
): Promise<Store[]> => {
  // For now, fetch all stores and filter client-side
  // In production, you'd use PostGIS for proper geospatial queries
  const stores = await fetchStores();
  
  return stores.filter(store => {
    if (!store.latitude || !store.longitude) return false;
    const distance = calculateDistance(lat, lng, store.latitude, store.longitude);
    return distance <= radiusKm;
  });
};

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => deg * (Math.PI / 180);
