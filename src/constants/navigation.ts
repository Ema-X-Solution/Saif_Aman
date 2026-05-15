import {
  Bell,
  Bus,
  ClipboardList,
  Cog,
  Gauge,
  LayoutDashboard,
  MapPin,
  School,
  Shield,
  Star,
  UserCog,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_NAV: SidebarNavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Schools", href: ROUTES.schools, icon: School },
  { label: "Drivers", href: ROUTES.drivers, icon: Users },
  { label: "Supervisors", href: ROUTES.supervisors, icon: UserRound },
  { label: "Buses", href: ROUTES.buses, icon: Bus },
  { label: "Areas", href: ROUTES.areas, icon: MapPin },
  { label: "Parent Requests", href: ROUTES.parentRequests, icon: ClipboardList },
  { label: "Reviews", href: ROUTES.reviews, icon: Star },
  { label: "Notifications", href: ROUTES.notifications, icon: Bell },
  { label: "Reports", href: ROUTES.reports, icon: Gauge },
  { label: "Admins", href: ROUTES.admins, icon: Shield },
  { label: "Settings", href: ROUTES.settings, icon: Cog },
  { label: "Profile", href: ROUTES.profile, icon: UserCog },
];
