import { LogOutBtn } from "./components/application/Log-out";
import { Onboarding } from "./components/application/onboarding/main";
import { useAuthToken } from "./hooks/use-auth-token";

function App() {
  const [authToken, refetch] = useAuthToken();
  if (!authToken) {
    return <Onboarding />;
  }

  return (
    <>
      <p>Hello world</p>

      <LogOutBtn
        callback={() => {
          refetch();
        }}
      />
    </>
  );
}

export default App;
