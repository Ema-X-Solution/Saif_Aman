"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useT } from "@/i18n/use-t";
import type { SchoolStudentStat } from "@/types/dashboard";

interface StudentStatsDonutInnerProps {
  data: SchoolStudentStat[];
}

export default function StudentStatsDonutInner({ data }: StudentStatsDonutInnerProps) {
  const t = useT();
  const total = data.reduce((sum, item) => sum + item.students, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <ul className="min-w-0 flex-1 space-y-2 text-sm">
        {data.map((item) => (
          <li key={item.school} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-muted-foreground">{item.school}</span>
            <span className="ms-auto font-medium">{item.students}</span>
          </li>
        ))}
      </ul>
      <div className="relative mx-auto h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="students"
              nameKey="school"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.school} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">{total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{t("dashboard.home.totalStudents")}</p>
        </div>
      </div>
    </div>
  );
}
