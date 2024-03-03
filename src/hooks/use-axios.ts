import axios from "axios";
import { useAppUrl } from "./use-app-url";
import { useAuthToken } from "./use-auth-token";

export const useAxios = () => {
  const [appUrl] = useAppUrl();
  const [authToken] = useAuthToken();

  const axiosInstance = axios.create({
    baseURL: appUrl,
    headers: {
      Authorization: authToken,
    },
  });

  return [axiosInstance, appUrl, authToken] as const;
};
