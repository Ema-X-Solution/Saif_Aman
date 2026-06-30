"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";

// Fix Leaflet marker issues in Next.js
function fixLeafletMarkers() {
  if (typeof window !== "undefined") {
    // @ts-expect-error - Fix Leaflet icon path
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }
}

interface ChangeMarkerPositionHandlerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

function ChangeMarkerPositionHandler({ position, onPositionChange }: ChangeMarkerPositionHandlerProps) {
  const markerRef = useRef<L.Marker>(null);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPos = marker.getLatLng();
          onPositionChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onPositionChange],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

// Handle map clicks to move marker
function MapClickHandler({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  height?: string;
}

function ChangeMapView({ position, zoom = 8 }: { position: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);

  return null;
}

export function LocationPicker({ latitude, longitude, onPositionChange, height = "400px" }: MapProps) {
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    fixLeafletMarkers();
    setIsLeafletReady(true);
  }, []);

  if (!isLeafletReady) return null;

  // Map tile layers (choose one based on your needs)
  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="rounded-lg border overflow-hidden bg-white dark:bg-transparent" style={{ height, zIndex: 1 }} dir="ltr">
      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution={tileLayers.osm.attribution}
          url={tileLayers.osm.url}
        />
        <ChangeMapView position={position} zoom={8} />
        <MapClickHandler onPositionChange={onPositionChange} />
        <ChangeMarkerPositionHandler
          position={position}
          onPositionChange={onPositionChange}
        />
      </MapContainer>
    </div>
  );
}

// Types for live map markers
interface SchoolMapPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  studentsCount?: number;
  busCount?: number;
}

interface BusMapPoint {
  id: string;
  label: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  color?: string;
  schoolName?: string;
  plateNumber?: string;
}

interface LiveMapProps {
  schools: SchoolMapPoint[];
  buses: BusMapPoint[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

// Custom icons for markers
const createSchoolIcon = () => L.divIcon({
  className: "custom-school-icon",
  html: `<div class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><path d="M9 10h.01"/><path d="M15 10h.01"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const createBusIcon = (color = "#22c55e") => L.divIcon({
  className: "custom-bus-icon",
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg" style="background-color: ${color}">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19"/><path d="M6 18h.01"/><path d="M18 18h.01"/><path d="M18 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2l-2 2H8l-2-2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14Z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export function LiveMap({ schools, buses, height = "400px", center, zoom = 10 }: LiveMapProps) {
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fixLeafletMarkers();
    setIsLeafletReady(true);
  }, []);

  // Calculate map center - always prioritize Oman first
  const mapCenter = useMemo((): [number, number] => {
    if (center) return center as [number, number];
    
    return [21.4735, 55.9754]; // Always center on Oman (Muscat)
  }, [center]);

  if (!isLeafletReady) return null;

  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  return (
    <div className="rounded-lg border overflow-hidden bg-white dark:bg-transparent" style={{ height, zIndex: 1, position: "relative" }} dir="ltr">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution={tileLayers.osm.attribution}
          url={tileLayers.osm.url}
        />

        {/* School Markers */}
        {schools.filter(s => s.latitude && s.longitude).map((school) => (
          <Marker
            key={`school-${school.id}`}
            position={[school.latitude!, school.longitude!]}
            icon={createSchoolIcon()}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold">{school.name}</h3>
                {school.address && <p className="text-sm text-muted-foreground">{school.address}</p>}
                <div className="text-xs">
                  {school.studentsCount !== undefined && <span>Students: {school.studentsCount}</span>}
                  {school.busCount !== undefined && <span> • Buses: {school.busCount}</span>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bus Markers */}
        {buses.filter(b => b.latitude && b.longitude).map((bus) => (
          <Marker
            key={`bus-${bus.id}`}
            position={[bus.latitude!, bus.longitude!]}
            icon={createBusIcon(bus.color)}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold">{bus.label}</h3>
                {bus.code && <p className="text-sm">Code: {bus.code}</p>}
                {bus.plateNumber && <p className="text-sm">Plate: {bus.plateNumber}</p>}
                {bus.schoolName && <p className="text-sm text-muted-foreground">School: {bus.schoolName}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
