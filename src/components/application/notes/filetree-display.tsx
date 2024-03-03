import { useAxios } from "@/hooks/use-axios";
import { useCurrentNote } from "@/lib/zustand/current-note";
import { Loader2 } from "lucide-react";
import { Fragment, useState } from "react";
import { useQuery } from "react-query";

type FileTreeItem =
  | {
      type: "note";
      entryName: string;
      noteId: string;
    }
  | {
      type: "folder";
      entryName: string;
      folderId: string;
      content: FileTreeItem[];
    };

export const FileTree = () => {
  const [axios, appUrl] = useAxios();

  const notesData = useQuery<
    {
      fileTree: FileTreeItem[];
    },
    {
      response?: { data?: string | null };
    }
  >({
    queryFn: async () => {
      return (await axios.get("/api/extension/notes/get-file-tree")).data;
    },
    queryKey: ["user-notes"],
    enabled: !!appUrl,
  });

  if (notesData.isLoading) {
    return (
      <p className="w-full text-center flex items-center gap-1 justify-center">
        Loading notes{" "}
        <Loader2 className="w-3 h-3 text-text-neutral-900 animate-spin" />
      </p>
    );
  }

  if (notesData.isError) {
    return (
      <p className="text-center text-neutral-700 w-full">
        Error: {notesData.error?.response?.data ?? "Cannot get notes."}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <FileTreeDisplay entries={notesData.data?.fileTree ?? []} />
    </div>
  );
};

const FileTreeDisplay = ({ entries }: { entries: FileTreeItem[] }) => {
  const { setCurrentNote } = useCurrentNote();

  return (
    <>
      {entries.map((entry) => (
        <Fragment key={entry.type === "note" ? entry.noteId : entry.folderId}>
          {entry.type === "folder" ? (
            <FolderDisplay entry={entry} />
          ) : (
            <button onClick={() => setCurrentNote(entry.noteId)}>
              Note: {entry.entryName}
            </button>
          )}
        </Fragment>
      ))}
    </>
  );
};

const FolderDisplay = ({ entry }: { entry: FileTreeItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (entry.type !== "folder") return null;

  return (
    <div className="flex flex-col items-start gap-1">
      <button onClick={() => setIsOpen(!isOpen)}>
        ({isOpen ? "open" : "closed"}) Folder: {entry.entryName}
      </button>

      {isOpen && (
        <div className="pl-2 flex flex-col gap-1 items-start">
          <FileTreeDisplay entries={entry.content} />
        </div>
      )}
    </div>
  );
};
