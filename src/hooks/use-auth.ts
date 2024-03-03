import { useQuery } from "react-query";
import { useAxios } from "./use-axios";

export const useAuth = () => {
  const [axios, _, authToken] = useAxios();
  const queryData = useQuery<
    {
      user: { username: string; email: string; id: string };
      extension: { id: string; extensionName: string };
    },
    {
      response?: { data?: string | null };
    }
  >({
    queryFn: async () => {
      return (await axios.get(`/api/extension/users/get-user-data`)).data;
    },
    queryKey: [`auth:q:${authToken}`],
    enabled: !!authToken,
  });

  return { ...queryData, authToken };
};
