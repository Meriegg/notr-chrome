import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useAxios } from "@/hooks/use-axios";
import { useCurrentNote } from "@/lib/zustand/current-note";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useQuery } from "react-query";
import "@blocknote/react/style.css";
import { useEffect, useState } from "react";

export const NoteDisplay = () => {
  const { setCurrentNote, currentNoteId: noteId } = useCurrentNote();
  const [noteContent, setNoteContent] = useState("");
  const [axios, appUrl] = useAxios();

  const currentNote = useQuery<
    { note: { title: string; tags: string[]; content: string } },
    { response: { data?: string | null } }
  >({
    queryFn: async () => {
      return (await axios.get(`/api/extension/notes/${noteId}`)).data;
    },
    queryKey: [`single-note:q:${noteId}`],
    enabled: !!appUrl,
    onSuccess: (data) => {
      setNoteContent(data.note.content);
    },
  });

  const editor: BlockNoteEditor = useBlockNote({
    editable: false,
  });

  useEffect(() => {
    if (!noteContent) return;

    editor.replaceBlocks(editor.topLevelBlocks, JSON.parse(noteContent));
  }, [noteContent]);

  if (currentNote.isLoading) {
    return (
      <p className="text-neutral-900 flex items-center gap-1 w-full justify-center text-center">
        Loading <Loader2 className="w-3 h-3 text-inherit animate-spin" />
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
    <div className="w-[500px] flex flex-col gap-2 overflow-x-hidden">
      <button
        onClick={() => setCurrentNote(null)}
        className="w-fit text-left flex items-center gap-1 mb-2 hover:underline"
      >
        <ChevronLeft className="w-3 h-3 text-inherit" /> Back
      </button>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {currentNote.data?.note.tags.map((tag, i) => <p key={i}>{tag}</p>)}
        </div>
        <h1 className="text-lg font-bold text-neutral-900">
          {currentNote.data?.note.title}
        </h1>
      </div>
      <div className="-ml-12 w-full">
        <BlockNoteView theme="light" editor={editor} />
      </div>
    </div>
  );
};
