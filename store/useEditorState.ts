import { ToolType } from "@/lib/constants";
import { FileUIPart } from "ai";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type EditorState = {
  image: string | null;
  mask: string | null;
  prompt: string;
  history: string[];
  historyIndex: number;
  showHistory: boolean;
  isLoading: boolean;
  userFiles: FileUIPart[];
  selectedTool: ToolType;
  brushSize: number;
  setMask: (mask: string) => void;
  setBrushSize: (size: number) => void;
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
  setSelectedTool: (tool: ToolType) => void;
};

export const useEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    image: null,
    mask: null,
    prompt: "",
    history: [],
    historyIndex: 0,
    showHistory: false,
    isLoading: false,
    userFiles: [],
    selectedTool: ToolType.MOVE,
    brushSize: 100,
    setMask: (mask: string) => {
      set({ mask });
    },
    setBrushSize: (size: number) => {
      set({ brushSize: size });
    },
    setSelectedTool: (tool: ToolType) => {
      set({ selectedTool: tool });
    },
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

      const finalPrompt = `
    TASK: Professional Image In-painting / Generative Fill.
    ROLE: Expert Photo Retoucher.

    INPUT DATA EXPLANATION:
    - You have received a primary image and a corresponding mask image.
    - The mask defines the precise editing region.
    - WHITE pixels in the mask indicate the area where you must apply the user's instruction.
    - BLACK pixels in the mask must remain exactly as they are in the original image.

    USER GOAL:
    "${state.prompt}"

    EXECUTION GUIDELINES (CRITICAL):
    1. IF REMOVING/ERASING: If the user asks to "remove", "erase", or "delete" an object, you MUST perform "Background Reconstruction". Analyze the surrounding background (wall, floor, nature) and seamlessly extend it over the masked area to hide the object.
    2. IF CHANGING/REPLACING: If the user asks to add or change something, generate the new object strictly within the white mask, matching the scene's lighting and perspective.
    3. SEAMLESS INTEGRATION: The new content generated inside the white masked area must perfectly match the surrounding environment's perspective, lighting direction, shadows, and color grading.
    4. TEXTURE MATCHING: Replicate the exact film grain, noise level, and sharpness of the original photo to prevent a "pasted-on" look. The transition at the mask boundary must be invisible.
    5. STRICT ISOLATION: Do not modify any pixels outside the designated white masked area under any circumstances`;

      // todo: try,catch, -> use finally block to set loading false
      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: state.image,
          prompt: finalPrompt,
          userFiles: state.userFiles,
          maskBase64: state.mask,
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
