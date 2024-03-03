import { create } from "zustand";

interface UseCurrentNote {
  currentNoteId: string | null;
  setCurrentNote: (id: string | null) => void;
}

export const useCurrentNote = create<UseCurrentNote>((set) => ({
  currentNoteId: null,
  setCurrentNote: (noteId) =>
    set(() => ({
      currentNoteId: noteId,
    })),
}));
