import { useState } from "react";
import { Store, MapPin, Users, Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import NearbyStoresList from "./NearbyStoresList";
import StoreMap from "./StoreMap";

const StoreNetworkSection = () => {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  return (
    <section className="py-12">
      <div className="rounded-2xl gradient-hero border border-primary/10 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              Store Network
            </h2>
            <p className="text-muted-foreground mt-1">
              Connect with grocery stores in your area (~5 km radius)
            </p>
          </div>
          
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-card p-4 border border-border/50 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">150+</p>
                <p className="text-xs text-muted-foreground">Registered Stores</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-card p-4 border border-border/50 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">25+</p>
                <p className="text-xs text-muted-foreground">Cities Covered</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-card p-4 border border-border/50 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5 km</p>
                <p className="text-xs text-muted-foreground">Network Radius</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map or List View */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {viewMode === "map" ? "Store Locations" : "Nearby Stores"}
          </h3>
          {viewMode === "map" ? <StoreMap /> : <NearbyStoresList />}
        </div>
      </div>
    </section>
  );
};

export default StoreNetworkSection;
