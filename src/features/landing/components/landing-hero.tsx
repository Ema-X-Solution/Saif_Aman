"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const DashboardPreview = dynamic(
  () => import("@/features/landing/components/landing-dashboard-preview"),
  { ssr: false, loading: () => <div className="h-[340px] w-full rounded-2xl bg-muted/40" /> },
);

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-[#F8FAFC] via-background to-background py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1D5FD018,transparent_55%)]" />
      <div className="container relative mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            School Bus Tracking System
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            SAIF AMAN · سيف أمان — enterprise-grade school transportation intelligence.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl text-lg text-muted-foreground"
          >
            GPS visibility, parent assurance, and admin governance in one premium
            Arabic & English workspace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href={ROUTES.login}>
                Launch console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#platform">Platform tour</Link>
            </Button>
            <Button size="lg" variant="ghost" type="button" className="text-muted-foreground">
              <Play className="h-4 w-4" />
              Watch overview
            </Button>
          </motion.div>
          <dl className="grid gap-6 pt-4 sm:grid-cols-3">
            {[
              { label: "Live buses", value: "120+" },
              { label: "Parent NPS", value: "68" },
              { label: "On-time", value: "94.6%" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="text-2xl font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
