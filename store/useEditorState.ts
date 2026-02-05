import { FileUIPart } from "ai";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type EditorState = {
  image: string | null;
  prompt: string;
  history: string[];
  historyIndex: number;
  showHistory: boolean;
  isLoading: boolean;
  userFiles: FileUIPart[];
  setUserFiles: (files: FileUIPart[]) => void;
  setHistory: (history: string[]) => void;
  setHistoryIndex: (index: number) => void;
  undo: () => void;
  redo: () => void;
  toggleHistory: () => void;
  setLoading: (val: boolean) => void;
  setImage: (ImageData: string) => void;
  setPrompt: (prompt: string) => void;
  generateEdit: () => Promise<void>;
  applyFilter: (prompt: string) => void;
  applyExpansion: (aspectRatio: string) => void;
};

export const useEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    image: null,
    prompt: "",
    history: [],
    historyIndex: 0,
    showHistory: false,
    isLoading: false,
    userFiles: [],
    setUserFiles: (files: FileUIPart[]) => {
      set({ userFiles: files });
    },
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
    setLoading: (val: boolean) => {
      set({ isLoading: val });
    },
    generateEdit: async () => {
      const state = get();
      set({ isLoading: true });

      // todo: try,catch, -> use finally block to set loading false
      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: state.image,
          prompt: state.prompt,
          userFiles: state.userFiles,
        }),
      });

      if (!response.ok) {
        set({ isLoading: false });
        throw new Error("failed to generate.");
      }

      const data = await response.json();

      const clonedHistory = [...state.history, data.result];

      set(() => ({
        image: data.result,
        history: clonedHistory,
        historyIndex: state.history.length,
        isLoading: false,
      }));
    },
    applyFilter: async (prompt: string) => {
      // prompt -> image -> send to model(server)
      const state = get();

      const finalPrompt = `
        ${prompt}
        TECHNICAL CONSTRAINTS:
        1. STRICTLY PRESERVE COMPOSITION: Do not change the subject's pose, the camera angle, or the placement of objects.
        2. OUTPUT FORMAT: This is a style transfer. Keep the underlying structure of the image identical to the original, only changing the texture, lighting, and colors to match the requested style.
      `;

      set({ isLoading: true });

      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: state.image,
          prompt: finalPrompt,
        }),
      });

      if (!response.ok) {
        set({ isLoading: false });
        throw new Error("failed to generate.");
      }

      const data = await response.json();
      const clonedHistory = [...state.history, data.result];

      set(() => ({
        image: data.result,
        history: clonedHistory,
        historyIndex: state.history.length,
        isLoading: false,
      }));
    },
    applyExpansion: async (aspectRatio: string) => {
      const state = get();
      if (!state.image) return;

      const baseInstruction = `High-fidelity outpainting. Analyze the visual context of the original image and seamlessly extend the scenery into the empty areas. Ensure the person's face and features remain completely unchanged`;

      const technicalConstraint = `Strictly maintain the continuity of existing lines, horizon, textures, lighting, and perspective. The transition must be invisible. Do not alter the style or content of the original center image `;

      const userContext = state.prompt
        ? `Addtional context/subject for extension: ${state.prompt}`
        : "";

      const finalPrompt = `
        ${baseInstruction}
        ${technicalConstraint}
        ${userContext}`;

      set({ isLoading: true });

      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: state.image,
          prompt: finalPrompt,
          aspectRatio: aspectRatio,
        }),
      });

      if (!response.ok) {
        set({ isLoading: false });
        throw new Error("failed to generate.");
      }

      const data = await response.json();
      const clonedHistory = [...state.history, data.result];

      set(() => ({
        image: data.result,
        history: clonedHistory,
        historyIndex: state.history.length,
        isLoading: false,
      }));
    },
    setPrompt: (prompt: string) => set({ prompt }),
  })),
);
