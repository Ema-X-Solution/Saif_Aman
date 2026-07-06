"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Users, Car, School, User, Phone, GraduationCap, Clock as PickedUp } from "lucide-react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { tripsService } from "@/services";
import type { Trip } from "@/types/trip";
import { useT } from "@/i18n/use-t";

function StudentsSubTable({ trip }: { trip: Trip }) {
  const t = useT();
  
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">{t("schools.students")} ({trip.students.length})</h4>
      <div className="grid gap-4">
        {trip.students.map((tripStudent) => (
          <div key={tripStudent.trip_student_id} className="flex flex-wrap items-center gap-6 p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-4">
              {tripStudent.student.image ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={tripStudent.student.image.replace(/`/g, '').trim()}
                    alt={tripStudent.student.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-1">
                <div className="font-semibold text-lg">{tripStudent.student.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {typeof tripStudent.student.grade === 'object' 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ? (tripStudent.student.grade as any)?.name || '' 
                    : tripStudent.student.grade}
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase">{t("common.parent")}</div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{tripStudent.student.parent.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {tripStudent.student.parent.phone}
                </div>
              </div>
              
              <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground uppercase">{t("trips.parentStatus")}</div>
        <Badge variant="outline" className={
          tripStudent.parent_status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
          tripStudent.parent_status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
        }>
          {tripStudent.parent_status}
        </Badge>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground uppercase">{t("trips.attendanceStatus")}</div>
        <Badge variant="outline" className={
          tripStudent.attendance_status === "present" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
          tripStudent.attendance_status === "absent" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
        }>
          {tripStudent.attendance_status}
        </Badge>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground uppercase">{t("trips.pickedUpAt")}</div>
        {tripStudent.picked_up_at ? (
          <div className="flex items-center gap-2">
            <PickedUp className="h-4 w-4 text-muted-foreground" />
            {new Date(tripStudent.picked_up_at).toLocaleString()}
          </div>
        ) : (
          <div className="text-muted-foreground">—</div>
        )}
      </div>
            </div>
            
            {tripStudent.absence_reason && (
              <div className="w-full">
                <div className="text-xs font-medium text-muted-foreground uppercase">{t("trips.absenceReason")}</div>
                <div className="text-sm">
                  {typeof tripStudent.absence_reason === 'object' 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ? (tripStudent.absence_reason as any)?.name || '' 
                    : tripStudent.absence_reason}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TripsView() {
  const t = useT();
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    (): ColumnDef<Trip>[] => [
      {
        id: "type",
        header: t("common.type"),
        accessorKey: "type",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <Badge variant="outline">
              {trip.type === "going" ? "Going" : "Back"}
            </Badge>
          );
        },
      },
      {
        id: "bus",
        header: t("buses.bus"),
        accessorKey: "bus",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{trip.bus.label}</div>
                <div className="text-xs text-muted-foreground">{trip.bus.plate_number}</div>
              </div>
            </div>
          );
        },
      },
      {
        id: "school",
        header: t("schools.school"),
        accessorKey: "school",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-muted-foreground" />
              <div>
              <div className="font-medium">{trip.school.name}</div>
              </div>
            </div>
          );
        },
      },
      {
        id: "driver",
        header: t("common.driver"),
        accessorKey: "driver",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
              <div className="font-medium">{trip.driver.name}</div>
              <div className="text-xs text-muted-foreground">{trip.driver.phone}</div>
              </div>
            </div>
          );
        },
      },
      {
        id: "supervisor",
        header: t("common.supervisor"),
        accessorKey: "supervisor",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
              <div className="font-medium">{trip.supervisor.name}</div>
              <div className="text-xs text-muted-foreground">{trip.supervisor.phone}</div>
              </div>
            </div>
          );
        },
      },
      {
        id: "students",
        header: t("schools.students"),
        accessorKey: "students",
        cell: ({ row }) => {
          const trip = row.original;
          return <div>{trip.students.length} {t("schools.students").toLowerCase()}</div>;
        },
      },
      {
        id: "startedAt",
        header: t("trips.startedAt"),
        accessorKey: "startedAt",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {new Date(trip.startedAt).toLocaleString()}
            </div>
          );
        },
      },
      {
        id: "endedAt",
        header: t("trips.endedAt"),
        accessorKey: "endedAt",
        cell: ({ row }) => {
          const trip = row.original;
          return (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {trip.endedAt ? new Date(trip.endedAt).toLocaleString() : "—"}
            </div>
          );
        },
      },
    ],
    [t]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await tripsService.list();
        if (!cancelled) setData(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("trips.title")}
        description={t("trips.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("trips.searchTrips")}
        globalSearchAccessor={(row) =>
          `${row.type} ${row.bus.label} ${row.bus.plate_number} ${row.school.name} ${row.driver.name} ${row.supervisor.name}`
        }
        renderSubComponent={({ row }) => <StudentsSubTable trip={row.original} />}
      />
    </div>
  );
}
