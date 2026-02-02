import { Loader2 } from "lucide-react";

function ImageGenerationLoading() {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-white tracking-tight">
        Generating...
      </h2>
      <p className="text-zinc-500 text-sm mt-1">Applying AI magic</p>
    </div>
  );
}

export default ImageGenerationLoading;
