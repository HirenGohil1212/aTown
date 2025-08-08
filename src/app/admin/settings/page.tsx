
"use server";

import { getSettings } from "@/actions/settings-actions";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Application Settings</h1>
        <p className="text-muted-foreground">
            Manage global settings for your application.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
