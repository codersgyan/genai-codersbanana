import {
  Crop,
  Film,
  Frame,
  Monitor,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  Square,
} from "lucide-react";

export const ratios = [
  // Square
  {
    label: "Square (1:1)",
    value: 1,
    aspectRatio: "1:1",
    icon: Square,
    desc: "Instagram Feed",
  },

  // Landscape / Wide
  {
    label: "Wide (16:9)",
    value: 16 / 9,
    aspectRatio: "16:9",
    icon: Monitor,
    desc: "YouTube / Video",
  },
  {
    label: "Standard (4:3)",
    value: 4 / 3,
    aspectRatio: "4:3",
    icon: RectangleHorizontal,
    desc: "Classic Camera",
  },
  {
    label: "Classic (3:2)",
    value: 3 / 2,
    aspectRatio: "3:2",
    icon: Frame,
    desc: "DSLR / Print",
  },
  {
    label: "Cinema (21:9)",
    value: 21 / 9,
    aspectRatio: "21:9",
    icon: Film,
    desc: "Ultrawide",
  },

  // Portrait / Tall
  {
    label: "Story (9:16)",
    value: 9 / 16,
    aspectRatio: "9:16",
    icon: Smartphone,
    desc: "TikTok / Reels",
  },
  {
    label: "Social (4:5)",
    value: 4 / 5,
    aspectRatio: "4:5",
    icon: Crop,
    desc: "Insta Portrait",
  },
  {
    label: "Poster (2:3)",
    value: 2 / 3,
    aspectRatio: "2:3",
    icon: RectangleVertical,
    desc: "Pinterest",
  },
];

export const filters = [
  {
    id: "cartoon",
    name: "Toonify",
    prompt:
      "Redraw the entire image as a vibrant 2D cartoon. Apply bold black outlines, flat coloring, and cel-shading globally to both the subject and the background. Simplify details into a clean comic book style.",
    image: "/filters/toonify.png",
  },
  {
    id: "ghibli",
    name: "Ghibli Studio",
    prompt:
      "Transform the whole image into a Studio Ghibli anime scene. Redraw everything with hand-painted backgrounds, vibrant natural greens and blues, fluffy clouds, and cel-shaded characters. Maintain the original composition but strictly enforce the Hayao Miyazaki art style.",
    image: "/filters/ghibli.png",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    prompt:
      "Apply a global Cyberpunk 2077 aesthetic. Shift the entire color palette to neon cyan, magenta, and deep black. Add a futuristic glow, rain reflections, and high-tech digital artifacts to the whole scene.",
    image: "/filters/cyberpunk.png",
  },
  {
    id: "oil_painting",
    name: "Oil Painting",
    prompt:
      "Re-imagine this image as a classic oil painting on canvas. Apply heavy, visible brushstrokes and rich impasto textures across the entire surface. Blend colors like an Impressionist master (Van Gogh style). Remove all photorealistic sharpness.",
    image: "/filters/oilpainting.png",
  },
];
