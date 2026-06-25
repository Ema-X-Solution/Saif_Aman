import {
  Bus,
  ClipboardList,
  Cog,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  Map,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface SidebarNavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_NAV: SidebarNavItem[] = [
  { labelKey: "sidebar.dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { labelKey: "sidebar.schools", href: ROUTES.schools, icon: School },
  { labelKey: "sidebar.buses", href: ROUTES.buses, icon: Bus },
  { labelKey: "sidebar.students", href: ROUTES.students, icon: GraduationCap },
  { labelKey: "sidebar.trips", href: ROUTES.trips, icon: Map },
  { labelKey: "sidebar.users", href: ROUTES.users, icon: Users },
  // { labelKey: "sidebar.areas", href: ROUTES.areas, icon: MapPin },
  { labelKey: "sidebar.parentRequests", href: ROUTES.parentRequests, icon: ClipboardList },
  // { labelKey: "sidebar.reviews", href: ROUTES.reviews, icon: Star },
  // { labelKey: "sidebar.notifications", href: ROUTES.notifications, icon: Bell },
  // { labelKey: "sidebar.reports", href: ROUTES.reports, icon: Gauge },
  // { labelKey: "sidebar.admins", href: ROUTES.admins, icon: Shield },
  { labelKey: "sidebar.settings", href: ROUTES.settings, icon: Cog },
  // { labelKey: "sidebar.profile", href: ROUTES.profile, icon: UserCog },
];
