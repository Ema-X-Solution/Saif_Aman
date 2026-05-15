"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bus, Shield, Smartphone } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export function LandingView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href={ROUTES.login}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.dashboard}>Open Dashboard</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <section className="space-y-6">
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            School Bus Tracking System
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            SAIF AMAN | <span dir="rtl">سيف أمان</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Smart platform for school transportation management, parent monitoring, and live fleet safety analytics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={ROUTES.dashboard}>
                Start demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={ROUTES.login}>Admin login</Link>
            </Button>
          </div>
        </section>
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {[Bus, Smartphone, Shield].map((Icon, i) => (
            <Card key={i} className="border-border/80">
              <CardContent className="p-6">
                <Icon className="mb-3 h-6 w-6 text-primary" />
                <p className="font-semibold">Enterprise-ready module</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Built for premium SaaS-grade transportation operations.
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.section>
      </main>
    </div>
  );
}
