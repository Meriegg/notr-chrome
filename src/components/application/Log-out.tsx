import { Button } from "../ui/button";

interface Props {
  callback?: () => void;
}

export const LogOutBtn = ({ callback }: Props) => {
  return (
    <Button
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
