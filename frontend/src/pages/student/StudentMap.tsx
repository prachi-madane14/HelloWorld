import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { progressAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Globe, Lock, Unlock, MapPin, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Country codes to names mapping
const countryNames: Record<string, string> = {
  USA: 'United States',
  GBR: 'United Kingdom',
  FRA: 'France',
  DEU: 'Germany',
  JPN: 'Japan',
  CHN: 'China',
  IND: 'India',
  BRA: 'Brazil',
  AUS: 'Australia',
  CAN: 'Canada',
  MEX: 'Mexico',
  ESP: 'Spain',
  ITA: 'Italy',
  RUS: 'Russia',
  KOR: 'South Korea',
  ARG: 'Argentina',
  ZAF: 'South Africa',
  EGY: 'Egypt',
  NGA: 'Nigeria',
  KEN: 'Kenya',
};

interface ProgressData {
  xp: number;
  level: number;
  countriesVisited: string[];
}

const StudentMap = () => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const response = await progressAPI.getStudentProgress();
      setProgress(response.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to load map data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const visitedCountries = progress?.countriesVisited || [];
  const totalCountries = Object.keys(countryNames).length;
  const exploredPercentage = Math.round((visitedCountries.length / totalCountries) * 100);

  const isVisited = (countryCode: string) => visitedCountries.includes(countryCode);
  
  // Countries unlock based on level
  const unlockedCountries = Object.keys(countryNames).slice(0, Math.min((progress?.level || 1) * 3, totalCountries));
  const isUnlocked = (countryCode: string) => unlockedCountries.includes(countryCode);

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            World Map Journey
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore countries and unlock new destinations as you level up!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-sm text-muted-foreground">Countries Explored</p>
            <p className="font-display text-2xl font-bold text-map">
              {visitedCountries.length} / {totalCountries}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="font-display text-2xl font-bold text-primary">
              {exploredPercentage}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-map" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/30" />
          <span>Unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>Locked</span>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl overflow-hidden relative"
      >
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button size="icon" variant="secondary" onClick={handleZoomIn}>
            +
          </Button>
          <Button size="icon" variant="secondary" onClick={handleZoomOut}>
            -
          </Button>
          <Button size="icon" variant="outline" onClick={handleReset}>
            <Globe className="h-4 w-4" />
          </Button>
        </div>

        {/* Hovered country info */}
        {hoveredCountry && (
          <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur border border-border rounded-lg px-4 py-2">
            <p className="font-medium">{countryNames[hoveredCountry] || hoveredCountry}</p>
            <p className="text-sm text-muted-foreground">
              {isVisited(hoveredCountry) ? (
                <span className="text-map flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Visited
                </span>
              ) : isUnlocked(hoveredCountry) ? (
                <span className="text-primary flex items-center gap-1">
                  <Unlock className="h-3 w-3" /> Available
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Level up to unlock
                </span>
              )}
            </p>
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
          }}
          style={{ width: '100%', height: '500px' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates as [number, number]}
            onMoveEnd={(pos) => setPosition(pos)}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A3 || geo.id;
                  const visited = isVisited(countryCode);
                  const unlocked = isUnlocked(countryCode);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(countryCode)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: visited
                            ? 'hsl(var(--map))'
                            : unlocked
                            ? 'hsl(var(--primary) / 0.3)'
                            : 'hsl(var(--muted))',
                          stroke: 'hsl(var(--border))',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: visited
                            ? 'hsl(var(--map))'
                            : unlocked
                            ? 'hsl(var(--primary) / 0.5)'
                            : 'hsl(var(--muted))',
                          stroke: 'hsl(var(--primary))',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                        },
                        pressed: {
                          fill: 'hsl(var(--primary))',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>

      {/* Visited Countries List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-map" />
          Your Visited Countries
        </h2>
        {visitedCountries.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {visitedCountries.map((code) => (
              <span
                key={code}
                className="px-3 py-1.5 bg-map/10 text-map rounded-full text-sm font-medium"
              >
                {countryNames[code] || code}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You haven't visited any countries yet. Start exploring!
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default StudentMap;
