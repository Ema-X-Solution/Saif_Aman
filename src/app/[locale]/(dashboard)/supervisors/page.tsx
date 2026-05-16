import { DEFAULT_LOCALE } from "@/constants/app";
import { redirect } from "next/navigation";

export default async function SupervisorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(
    locale === DEFAULT_LOCALE
      ? "/users?tab=supervisors"
      : `/${locale}/users?tab=supervisors`,
  );
}
