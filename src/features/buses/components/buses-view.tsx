"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddBusDialog } from "@/features/buses/components/add-bus-dialog";
import { EditBusDialog } from "@/features/buses/components/edit-bus-dialog";
import { BusDetailsDialog } from "@/features/buses/components/bus-details-dialog";
import { AssignBackupCrewDialog } from "@/features/buses/components/assign-backup-crew-dialog";
import { DeleteBusDialog } from "@/features/buses/components/delete-bus-dialog";
import { buildBusColumns } from "@/features/buses/lib/buses-columns";
import { busesService } from "@/services/buses.service";
import { schoolsService } from "@/services/schools.service";
import type { Bus } from "@/types/bus";
import type { School } from "@/types/school";
import { useT } from "@/i18n/use-t";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BusesView() {
  const t = useT();
  const [data, setData] = useState<Bus[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [viewingBus, setViewingBus] = useState<Bus | null>(null);
  const [backupCrewBus, setBackupCrewBus] = useState<Bus | null>(null);
  const [deletingBus, setDeletingBus] = useState<Bus | null>(null);
  const [detailsRefreshKey, setDetailsRefreshKey] = useState(0);
  const [selectedSchool, setSelectedSchool] = useState<string>("all");

  const columns = useMemo(
    () =>
      buildBusColumns(
        t,
        setEditingBus,
        setViewingBus,
        setBackupCrewBus,
        setDeletingBus
      ),
    [t]
  );

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await busesService.list();
        if (!c) setData(rows);
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSchoolsLoading(true);
      try {
        const rows = await schoolsService.list();
        if (!cancelled) setSchools(rows);
      } finally {
        if (!cancelled) setSchoolsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filterFn = useMemo(() => {
    if (selectedSchool === "all") {
      return () => true;
    }
    return (bus: Bus) => bus.schoolId === selectedSchool;
  }, [selectedSchool]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("buses.title")}
        description={t("buses.description")}
        actions={<AddBusDialog onCreated={() => setReloadKey((k) => k + 1)} />}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("buses.searchBuses")}
        globalSearchAccessor={(row) =>
          `${row.plateNumber} ${row.schoolName} ${row.areaLabels.join(" ")}`
        }
        filterFn={filterFn}
        filtersSlot={
          <div className="flex items-center gap-3">
            <Select value={selectedSchool} onValueChange={setSelectedSchool} disabled={schoolsLoading}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("schools.selectSchool")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
      <EditBusDialog
        bus={editingBus}
        onClose={() => setEditingBus(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      <BusDetailsDialog
        bus={viewingBus}
        refreshKey={detailsRefreshKey}
        onClose={() => setViewingBus(null)}
        onAssignBackupCrew={setBackupCrewBus}
      />
      <AssignBackupCrewDialog
        bus={backupCrewBus}
        onClose={() => setBackupCrewBus(null)}
        onUpdated={() => {
          setReloadKey((k) => k + 1);
          setDetailsRefreshKey((k) => k + 1);
        }}
      />
      <DeleteBusDialog
        bus={deletingBus}
        onClose={() => setDeletingBus(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
