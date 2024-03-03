import { useAxios } from "@/hooks/use-axios";
import { useCurrentNote } from "@/lib/zustand/current-note";
import { Loader2 } from "lucide-react";
import { useQuery } from "react-query";

export const NoteDisplay = () => {
  const { setCurrentNote, currentNoteId: noteId } = useCurrentNote();
  const [axios] = useAxios();

  const currentNote = useQuery<
    { note: { title: string; tags: string[]; content: string } },
    { response: { data?: string | null } }
  >({
    queryFn: async () => {
      return (await axios.get(`/api/extension/notes/get-note/${noteId}`)).data;
    },
    queryKey: [`single-note:q:${noteId}`],
  });

  if (currentNote.isLoading) {
    return (
      <p className="text-neutral-900 flex items-center gap-1 w-full justify-center text-center">
        Loading <Loader2 className="w-3 h-3 text-inherit" />
      </p>
    );
  }

  if (currentNote.isError) {
    return (
      <p className="text-neutral-900 flex items-center gap-1 w-full justify-center text-center">
        Error: {currentNote.error?.response?.data ?? "Cannot get note."}
      </p>
    );
  }

  return (
    <div>
      <button onClick={() => setCurrentNote(null)}>Back</button>
      <pre>{JSON.stringify(currentNote.data, null, 2)}</pre>
    </div>
  );
};
