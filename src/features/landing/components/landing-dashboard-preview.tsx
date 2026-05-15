"use client";

import { motion } from "framer-motion";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingDashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-[#1D5FD0]/30 via-transparent to-[#F4B400]/25 blur-3xl" />
      <Card className="relative overflow-hidden border-border/80 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live map
            </p>
            <p className="text-lg font-semibold">North Riyadh fleet</p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            All systems nominal
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-48 overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/40">
            <motion.div
              className="absolute inset-y-8 left-8 w-[65%] rounded-2xl bg-gradient-to-r from-primary/25 to-accent/30"
              animate={{ x: [0, 18, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute bottom-4 right-4 rounded-full bg-background/90 px-3 py-1 text-xs shadow-sm">
              Bus RJD 8841 · 38 km/h
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-3">
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
