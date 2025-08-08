
"use client";

import { useActionState, useEffect } from "react";
import { updateSettings } from "@/actions/settings-actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppSettings } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type SettingsFormProps = {
  settings: AppSettings;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
    </Button>
  );
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, action] = useActionState(updateSettings, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Success", description: "Settings have been updated." });
    } else if (state?.error) {
       const errorMessages = Object.values(state.error).flat().join(" \n");
       toast({
          variant: "destructive",
          title: "Error updating settings",
          description: errorMessages,
       });
    }
  }, [state, toast]);

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Control user registration for your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="allow-signups" className="flex flex-col space-y-1">
              <span>Allow New User Signups</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable this to allow new users to create accounts.
              </span>
            </Label>
            <Switch
              id="allow-signups"
              name="allowSignups"
              defaultChecked={settings.allowSignups}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>Manage order and contact settings for your store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              placeholder="e.g. 911234567890"
              defaultValue={settings.whatsappNumber}
            />
            <p className="text-xs text-muted-foreground">
              Enter the number including country code, without '+' or spaces.
            </p>
            {state?.error?.whatsappNumber && <p className="text-destructive text-sm">{state.error.whatsappNumber[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
            <Input
              id="minOrderQuantity"
              name="minOrderQuantity"
              type="number"
              placeholder="e.g. 4"
              defaultValue={settings.minOrderQuantity}
            />
            <p className="text-xs text-muted-foreground">
              The minimum total number of items required to place an order.
            </p>
            {state?.error?.minOrderQuantity && <p className="text-destructive text-sm">{state.error.minOrderQuantity[0]}</p>}
          </div>
        </CardContent>
      </Card>

      {state?.error?._server && <div className="text-destructive text-sm mt-2">{state.error._server[0]}</div>}

      <div className="mt-6 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
