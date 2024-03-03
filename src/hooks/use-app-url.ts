import { useState } from "react";

export const useAppUrl = () => {
  const [appUrl, setAppUrl] = useState("");

  chrome.storage.local.get(["appUrl"], (items) => {
    setAppUrl(items.appUrl);
  });

  const refetch = () => {
    chrome.storage.local.get(["appUrl"], (items) => {
      setAppUrl(items.appUrl);
    });
  };

  return [appUrl, refetch] as const;
};
