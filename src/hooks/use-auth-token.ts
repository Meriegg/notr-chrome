import { useState } from "react";

export const useAuthToken = () => {
  const [authToken, setAuthToken] = useState("");

  chrome.storage.local.get(["auth_token"], (items) => {
    setAuthToken(items.auth_token);
  });

  const refetch = () => {
    chrome.storage.local.get(["auth_token"], (items) => {
      setAuthToken(items.auth_token);
    });
  };

  return [authToken, refetch] as const;
};
