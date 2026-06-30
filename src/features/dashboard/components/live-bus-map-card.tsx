"use client";

import { Bus, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import { LiveMap } from "@/components/map";
import type { School } from "@/types/school";
import type { Bus as BusType } from "@/types/bus";
import type { ApiTrip } from "@/types/trip";

interface LiveBusMapCardProps {
  schools: School[];
  buses: BusType[];
  trips: ApiTrip[];
}

export function LiveBusMapCard({ schools, buses, trips }: LiveBusMapCardProps) {
  const t = useT();

  // Prepare bus map points - link with trips for location if available
  const busMapPoints = buses.map((bus) => {
    // Find active trip for this bus
    const activeTrip = trips.find(trip =>
      trip.bus.id === Number(bus.id) && trip.ended_at === null
    );

    // For now, use school location if available, or default to school's location
    const school = schools.find(s => s.id === bus.schoolId);

    // Generate coordinates around school in Oman
    const baseLat = school?.latitude || 23.5880; // Default to Muscat
    const baseLng = school?.longitude || 58.3920; // Default to Muscat
    const offsetLat = activeTrip ? (Math.random() - 0.5) * 0.05 : 0; // Smaller offset
    const offsetLng = activeTrip ? (Math.random() - 0.5) * 0.05 : 0;

    return {
      id: bus.id,
      label: bus.label,
      code: bus.code,
      latitude: baseLat + offsetLat,
      longitude: baseLng + offsetLng,
      color: activeTrip ? "#22c55e" : "#94a3b8", // Green for active, gray for inactive
      schoolName: bus.schoolName,
      plateNumber: bus.plateNumber,
      isActive: !!activeTrip,
    };
  });

  // Prepare school map points
  const schoolMapPoints = schools.filter(s => s.latitude && s.longitude).map((school) => ({
    id: school.id,
    name: school.name,
    latitude: school.latitude!,
    longitude: school.longitude!,
    address: school.address,
    studentsCount: school.studentCount,
    busCount: school.busCount,
  }));

  const activeTripsCount = trips.filter(t => t.ended_at === null).length;

  return (
    <Card className="h-full border-border/80 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/15">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-base font-semibold">
              {t("dashboard.liveTracking.mapTitle")}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1">
            <Bus className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {activeTripsCount}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("dashboard.liveTracking.activeBuses")}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] rounded-xl border border-border/60 overflow-hidden">
          <LiveMap
            schools={schoolMapPoints}
            buses={busMapPoints}
            height="280px"
            zoom={7}
          />
        </div>
        <div className="mt-3 flex gap-6 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-sm">School</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm">Active Trip</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <span className="text-sm">Inactive Bus</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
