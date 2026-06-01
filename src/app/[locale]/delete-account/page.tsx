import type { Metadata } from "next";

import { APP_NAME_AR, APP_NAME_EN } from "@/constants/app";
import { DeleteAccountView } from "@/features/delete-account/components/delete-account-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Delete Account | ${APP_NAME_EN} | ${APP_NAME_AR}`,
    description: "Delete your account securely.",
  };
}

export default function DeleteAccountPage() {
  return <DeleteAccountView />;
}
