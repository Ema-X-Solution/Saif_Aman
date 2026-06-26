"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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
    <div className="rounded-lg border overflow-hidden bg-white dark:bg-transparent" style={{ height, zIndex: 10 }} dir="ltr">
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
