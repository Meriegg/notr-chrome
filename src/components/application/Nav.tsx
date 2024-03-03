import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { LogOutBtn } from "./Log-out";
import { queryClient } from "@/main";

export const Nav = () => {
  const auth = useAuth();
  if (auth.isLoading) {
    return <Loader2 className="w-3 h-3 animate-spin text-neutral-900" />;
  }

  if (auth.isError || !auth.authToken) {
    return (
      <p className="text-center text-neutral-700 w-full">
        You are not logged in.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between w-full p-2 border-b-[1px] border-neutral-50">
      <div className="flex flex-col gap-0">
        <p className="max-w-full text-neutral-900">
          {auth.data?.user.username}
        </p>
        <p className="truncate max-w-full text-xs text-neutral-700">
          {auth.data?.user.email}
        </p>

        <LogOutBtn
          className="bg-transparent w-fit hover:bg-transparent shadow-none p-0 text-xs h-auto text-red-900 hover:underline"
          callback={() => {
            queryClient.invalidateQueries([`auth:q:${auth.authToken}`]);
          }}
        />
      </div>

      <p className="max-w-full px-2 py-1 rounded-lg bg-neutral-50">
        ext. {auth.data?.extension.extensionName}
      </p>
    </div>
  );
};
