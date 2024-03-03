import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StepProps } from "./main";
import { useQuery } from "react-query";

export const Step2 = ({ setCurrentStep }: StepProps) => {
  const [showNextButton, setShowNextButton] = useState(false);
  const [appUrl, setAppUrl] = useState("");
  const [isError, setError] = useState(false);
  const [finishedVerifications, setFinishedVerifications] = useState<{
    auth: boolean;
    users: boolean;
    notes: boolean;
  }>({
    auth: false,
    users: false,
    notes: false,
  });

  const userAPIVerification = useQuery({
    queryFn: () => {
      return axios.get(`${appUrl}/api/extension/users/verify`);
    },
    enabled: !!appUrl.length,
    queryKey: [`userverify_${appUrl}`],
    onError: () => {
      setError(true);
    },
    onSettled: () => {
      setFinishedVerifications({ ...finishedVerifications, users: true });
    },
  });

  const noteAPIVerification = useQuery({
    queryFn: () => {
      return axios.get(`${appUrl}/api/extension/notes/verify`);
    },
    enabled: !!appUrl.length,
    queryKey: [`noteverify_${appUrl}`],
    onError: () => {
      setError(true);
    },
    onSettled: () => {
      setFinishedVerifications({ ...finishedVerifications, notes: true });
    },
  });

  const authAPIVerification = useQuery({
    queryFn: () => {
      return axios.get(`${appUrl}/api/extension/auth/verify`);
    },
    queryKey: [`authverify_${appUrl}`],
    enabled: !!appUrl.length,
    onError: () => {
      setError(true);
    },
    onSettled: () => {
      setFinishedVerifications({ ...finishedVerifications, auth: true });
    },
  });

  chrome.storage.local.get(["appUrl"], (items) => {
    setAppUrl(items.appUrl ?? "");
  });

  useEffect(() => {
    if (!appUrl) return;

    if (
      Object.values(finishedVerifications).every((val) => val === true) &&
      !isError
    )
      setShowNextButton(true);
  }, [appUrl, finishedVerifications, isError]);

  if (!appUrl) {
    return (
      <div className="mt-4 w-full flex flex-col gap-2 text-center">
        <p className="text-sm text-neutral-900">
          No app url present, please re-enter your app url.
        </p>
        <Button
          onClick={() => {
            chrome.storage.local.set({ onboardingStep: 0 });
            setCurrentStep(0);
          }}
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-4 w-full">
      <p className="font-semibold text-center text-neutral-900">
        Verifying URL: {appUrl}
      </p>

      {isError && (
        <p className="text-center w-full px-2 py-2 rounded-md bg-red-50 text-red-900">
          Oops, looks like your URL is invalid, please go back and enter in the
          correct one.
        </p>
      )}

      <div className="flex items-center gap-1 text-neutral-900">
        <p className="px-2 py-1 rounded-md bg-neutral-50">Users</p>
        {userAPIVerification.isLoading && (
          <Loader2 className="w-3 h-3 text-inherit animate-spin" />
        )}
        {userAPIVerification.isError && (
          <p className="px-2 py-1 bg-red-50 text-red-900">
            Failed:{" "}
            {(userAPIVerification.error as any)?.message ??
              "No error message available."}
          </p>
        )}

        {userAPIVerification.isSuccess && (
          <p className="px-2 py-1 bg-green-50 text-green-900">Success</p>
        )}
      </div>

      <div className="flex items-center gap-1 text-neutral-900">
        <p className="px-2 py-1 rounded-md bg-neutral-50">Notes</p>
        {noteAPIVerification.isLoading && (
          <Loader2 className="w-3 h-3 text-inherit animate-spin" />
        )}
        {noteAPIVerification.isError && (
          <p className="px-2 py-1 bg-red-50 text-red-900">
            Failed:{" "}
            {(noteAPIVerification.error as any)?.message ??
              "No error message available."}
          </p>
        )}

        {noteAPIVerification.isSuccess && (
          <p className="px-2 py-1 bg-green-50 text-green-900">Success</p>
        )}
      </div>

      <div className="flex items-center gap-1 text-neutral-900">
        <p className="px-2 py-1 rounded-md bg-neutral-50">Auth</p>
        {authAPIVerification.isLoading && (
          <Loader2 className="w-3 h-3 text-inherit animate-spin" />
        )}
        {authAPIVerification.isError && (
          <p className="px-2 py-1 bg-red-50 text-red-900">
            Failed:{" "}
            {(authAPIVerification.error as any)?.message ??
              "No error message available."}
          </p>
        )}

        {authAPIVerification.isSuccess && (
          <p className="px-2 py-1 bg-green-50 text-green-900">Success</p>
        )}
      </div>

      {isError && (
        <Button
          onClick={() => {
            chrome.storage.local.set({ onboardingStep: 0 });
            setCurrentStep(0);
          }}
        >
          Go back?
        </Button>
      )}

      {showNextButton && (
        <Button
          onClick={() => {
            chrome.storage.local.set({ onboardingStep: 2 });
            setCurrentStep(2);
          }}
        >
          Final step
        </Button>
      )}
    </div>
  );
};
