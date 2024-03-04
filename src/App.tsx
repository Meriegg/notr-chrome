import { Loader2 } from "lucide-react";
import { Onboarding } from "./components/application/onboarding/main";
import { useAuth } from "./hooks/use-auth";
import { Nav } from "./components/application/Nav";
import { FileTree } from "./components/application/notes/filetree-display";
import { useCurrentNote } from "./lib/zustand/current-note";
import { NoteDisplay } from "./components/application/notes/note-display";

function App() {
  const { currentNoteId } = useCurrentNote();

  const auth = useAuth();
  if (auth.isLoading) {
    return (
      <p className="w-full h-full py-4 text-center text-neutral-900 flex justify-center gap-1 items-center">
        Loading...
        <Loader2 className="animate-spin w-4 h-4 flex text-inherit" />
      </p>
    );
  }

  if (auth.isError || !auth.authToken) {
    return <Onboarding />;
  }

  return (
    <>
      <Nav />

      <div className="p-2">
        {currentNoteId ? <NoteDisplay /> : <FileTree />}
      </div>
    </>
  );
}

export default App;
