import { Button } from "@/components/ui/button";
import { StepProps } from "./main";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "react-query";
import { Loader2 } from "lucide-react";
import { useAxios } from "@/hooks/use-axios";

export const Step3 = ({}: StepProps) => {
  const [authorizationToken, setAuthorizationToken] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [axios] = useAxios();
  const appExtensionsLink = `${appUrl}/application/extensions`;

  chrome.storage.local.get(["appUrl"], (items) => {
    setAppUrl(items.appUrl ?? "");
  });

  const verifyMutation = useMutation<
    { success: true },
    { response?: { data?: string }; message?: string | null }
  >({
    mutationFn: () => {
      return axios.post("/api/extension/auth/authorize", {
        extensionToken: authorizationToken,
      });
    },
    onSuccess: () => {
      chrome.storage.local.set({
        auth_token: authorizationToken,
        onboardingStep: 0,
      });
      window.location.reload();
    },
  });

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <p className="text-center text-neutral-900">
        All of your settings have been saved! Now go to{" "}
        <a
          onClick={() => chrome.tabs.create({ url: appExtensionsLink })}
          href={appExtensionsLink}
          className="text-neutral-900 underline"
        >
          this page
        </a>
        , create an authorization token, and paste it in the input down below in
        order to coninue.
      </p>

      <p className="text-neutral-700 my-2">
        Saved app url:{" "}
        <span className="text-neutral-900 font-bold">{appUrl}</span>
      </p>

      {verifyMutation.isError && (
        <p className="w-full text-center text-red-900 bg-red-50 rounded-lg py-4">
          Error:{" "}
          {verifyMutation.error?.response?.data ?? "Unable to verify token."}
        </p>
      )}

      <Textarea
        className="min-h-[75px]"
        placeholder="Authorization token"
        value={authorizationToken}
        onChange={(e) => setAuthorizationToken(e.target.value)}
      />

      <Button
        disabled={!authorizationToken || verifyMutation.isLoading}
        className="w-full"
        onClick={() => {
          verifyMutation.mutate();
        }}
      >
        Verify{" "}
        {verifyMutation.isLoading && (
          <Loader2 className="w-3 h-3 animate-spin text-inherit" />
        )}
      </Button>
    </div>
  );
};
