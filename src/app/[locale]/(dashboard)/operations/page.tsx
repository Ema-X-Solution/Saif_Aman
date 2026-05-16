import { DEFAULT_LOCALE } from "@/constants/app";
import { redirect } from "next/navigation";

/** Legacy hub URL → schools list. */
export default async function OperationsLegacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(
    locale === DEFAULT_LOCALE ? "/schools" : `/${locale}/schools`,
  );
}
