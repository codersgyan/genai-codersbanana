import { create } from "zustand";
import { devtools } from "zustand/middleware";

type EditorState = {
  image: string | null;
  prompt: string;
  history: string[];
  historyIndex: number;
  showHistory: boolean;
  setHistory: (history: string[]) => void;
  setHistoryIndex: (index: number) => void;
  undo: () => void;
  redo: () => void;
  toggleHistory: () => void;
  setImage: (ImageData: string) => void;
  setPrompt: (prompt: string) => void;
  generateEdit: () => Promise<void>;
};

export const useEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    image: null,
    prompt: "",
    history: [],
    historyIndex: 0,
    showHistory: false,
    setImage: (imageData: string) =>
      set(() => ({
        image: imageData,
        history: [imageData],
      })),
    setHistory: (history) => set({ history }),
    setHistoryIndex: (index: number) => {
      const state = get();
      return set({
        historyIndex: index,
        image: state.history[index],
      });
    },
    undo: () => {
      const state = get();

      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1; // 0 -> -1
        set({
          image: state.history[newIndex],
          historyIndex: newIndex,
        });
      }
    },
    redo: () => {
      const state = get();

      if (state.historyIndex < state.history.length - 1) {
        // 4 -> 3
        const newIndex = state.historyIndex + 1;

        set({
          historyIndex: newIndex,
          image: state.history[newIndex],
        });
      }
    },
    toggleHistory: () => {
      const state = get();
      if (state.history.length) {
        set({
          showHistory: !state.showHistory,
        });
      }
    },
    generateEdit: async () => {
      const state = get();
      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: state.image,
          prompt: state.prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("failed to generate.");
      }

      const data = await response.json();

      const clonedHistory = [...state.history, data.result];

      set(() => ({
        image: data.result,
        history: clonedHistory,
        historyIndex: state.history.length,
      }));
    },
    setPrompt: (prompt: string) => set({ prompt }),
  })),
);
