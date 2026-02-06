import { useEditorStore } from "@/store/useEditorState";
import { useCallback, useEffect, useRef } from "react";

const ImageEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image } = useEditorStore();

  const draw = useCallback(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (!image) return;
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvasRef.current!.width = img.naturalWidth;
      canvasRef.current!.height = img.naturalHeight;

      // clear the canvas
      ctx.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height,
      );

      // draw the image
      ctx.drawImage(img, 0, 0);
    };
  }, [image]);

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      draw();
    };
  }, [image, draw]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"></canvas>
    </div>
  );
};

export default ImageEditor;
