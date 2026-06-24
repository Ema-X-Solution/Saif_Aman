"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BellRing, MapPin, Shield, Smartphone } from "lucide-react";
import Image from "next/image";

import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME_AR, APP_NAME_EN } from "@/constants/app";
import { useT } from "@/i18n/use-t";

export function LandingView() {
  const t = useT();


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 font-sans overflow-hidden">
      <PublicHeader className="!border-none !bg-transparent backdrop-blur-none" />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="grid items-center gap-12 pb-20 pt-10 lg:grid-cols-2 lg:gap-8 lg:pt-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8 relative z-10"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary me-2"></span>
                {t("landing.badge")}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                {APP_NAME_EN} <br />
                <span dir="rtl" className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{APP_NAME_AR}</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                {t("landing.subhead")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <Link href="https://apps.apple.com/eg/app/saif-aman/id6768245808" target="_blank" rel="noopener noreferrer">
                  <Smartphone className="me-2 h-5 w-5" />
                  {t("landing.downloadAppStore") || "Download on the App Store"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all bg-background/50 backdrop-blur-sm">
                <Link href="#">
                  {t("landing.getGooglePlay") || "Get it on Google Play"}
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted overflow-hidden">
                    <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=parent${i}`} alt="Avatar" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                  </div>
                ))}
              </div>
              <p className="font-medium">Trusted by thousands of parents daily.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none"
          >
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-full -z-10" /> */}
            <Image
              src="/images/mockup1.png"
              alt="SAIF AMAN App Mockup"
              width={500}
              height={700}
              className="rounded-xl  hover:-translate-y-2 transition-transform duration-700 ease-out  "
              priority
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -z-10 skew-y-3 transform origin-bottom-left" />
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Why choose {APP_NAME_EN}?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience peace of mind with our state-of-the-art school bus tracking system built specifically for parents and schools.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: MapPin, title: t("landing.featureLiveMap") || "Live Fleet Tracking", desc: t("landing.featureLiveMapHint") || "Real-time visibility." },
              { icon: BellRing, title: t("landing.featureNotifications") || "Instant Alerts", desc: t("landing.featureNotificationsHint") || "Receive push notifications." },
              { icon: Shield, title: t("landing.featureSecure") || "Secure Platform", desc: t("landing.featureSecureHint") || "End-to-end encryption." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-background/60 backdrop-blur-md hover:shadow-xl transition-all hover:border-primary/30 group">
                  <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-gradient-to-br from-primary to-primary/80 px-6 py-20 sm:py-24 text-primary-foreground shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
                {t("landing.downloadCtaTitle") || "Ready to track your child's journey?"}
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-xl mx-auto">
                {t("landing.downloadCtaDesc") || "Download the SAIF AMAN parent app today."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" variant="secondary" className="h-14 px-8 rounded-full shadow-xl hover:scale-105 transition-transform text-primary font-semibold">
                  <Link href="https://apps.apple.com/eg/app/saif-aman/id6768245808" target="_blank" rel="noopener noreferrer">
                    <Smartphone className="me-2 h-5 w-5" />
                    App Store
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-xl hover:scale-105 transition-transform font-semibold">
                  <Link href="#">
                    Google Play
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
