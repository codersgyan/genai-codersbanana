import { create } from "zustand";
import { devtools } from "zustand/middleware";

type EditorState = {
  image: string | null;
  prompt: string;
  setImage: (ImageData: string) => void;
  setPrompt: (prompt: string) => void;
  generateEdit: () => Promise<void>;
};

export const useEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    image: null,
    prompt: "",
    setImage: (imageData: string) =>
      set(() => ({ image: imageData })),
    generateEdit: async () => {
      const state = get();

      console.log("Sending image and prompt to server...");
      // console.log("Prompt", state.prompt);
      // console.log("Image", state.image);
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
      set(() => ({ image: data.result }));
    },
    setPrompt: (prompt: string) => set({ prompt }),
  })),
);
