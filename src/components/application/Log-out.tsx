import { Button } from "../ui/button";

interface Props {
  callback?: () => void;
  className?: string;
}

export const LogOutBtn = ({ callback, className }: Props) => {
  return (
    <Button
      className={className}
      onClick={() => {
        chrome.storage.local.remove(["auth_token"]).then(() => {
          if (callback) callback();
        });
      }}
    >
      Log out
    </Button>
  );
};
