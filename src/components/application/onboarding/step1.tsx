import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepProps } from "./main";

export const Step1 = ({ setCurrentStep }: StepProps) => {
  const [appUrl, setAppUrl] = useState("");

  return (
    <div className="flex flex-col gap-1 mt-4 w-full">
      <Input
        placeholder="Your app's URL"
        className="w-full"
        value={appUrl}
        onChange={(e) => setAppUrl(e.target.value)}
      />
      <Button
        onClick={() => {
          const { success } = z.string().url().safeParse(appUrl);
          if (!success) {
            return;
          }

          chrome.storage.local.set({ appUrl, onboardingStep: 1 });
          setCurrentStep(1);
        }}
        disabled={!z.string().url().safeParse(appUrl).success}
        className="w-full mt-2"
      >
        Next step
      </Button>
    </div>
  );
};
