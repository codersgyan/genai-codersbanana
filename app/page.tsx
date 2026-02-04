"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { LeftSidebar } from "@/components/left-sidebar";
import ImageGenerationLoading from "@/components/image-generation";
import { AIPromptInput } from "@/components/prompt-input";
import { RightSidebar } from "@/components/right-sidebar";
import { useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorState";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { image, setImage, showHistory } = useEditorStore();
  // const [image, setImage] = useState("");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      setImage(result as string);
    };

    reader.readAsDataURL(file as File);
  };

  return (
    <>
      <div className="w-full h-dvh flex flex-col overflow-hidden">
        <input
          ref={fileInputRef}
          onChange={handleImageUpload}
          type="file"
          accept="image/*"
          className="hidden"
        />

        <Navbar />
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* LEFT COLUMN */}
          <LeftSidebar />

          {/* MIDDLE COLUMN */}
          <main className="flex-1 flex flex-col min-w-0 bg-zinc-900/50 relative">
            {/* CANVAS AREA */}
            <div className="flex-1 relative overflow-hidden w-full h-full">
              {/* BACKGROUND PATTERN */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}></div>

              {/* MAIN EDITOR SCREEN */}
              <div className="w-full h-full flex items-center justify-center p-6 md:p-10">
                {!image ? (
                  <div className="text-center space-y-6 max-w-sm z-10 ">
                    <div className="w-24 h-24 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl shadow-yellow-900/10">
                      <Image
                        src={"/logo.png"}
                        width={500}
                        height={500}
                        alt="logo"
                        className=""
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-100">
                        Start Creating
                      </h3>
                      <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
                        Upload an image to unlock the full
                        potential of{" "}
                        <span className="text-yellow-500 font-medium">
                          Coder&apos;s Banana
                        </span>{" "}
                        AI tools.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      className="w-full h-11 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02]">
                      Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      width="500"
                      height="500"
                      src={image}
                      alt=""
                    />
                  </div>
                )}
              </div>

              {/* render when image in generating */}
              {/* <ImageGenerationLoading /> */}
            </div>

            {/* PROMPT INPUT AREA */}
            <div className="shrink-0 bg-zinc-950 border-t border-zinc-800 p-4 lg:p-6 z-40">
              <AIPromptInput />
            </div>
          </main>

          {/* RIGHT COLUMNS EDIT HISTORY */}
          {showHistory && <RightSidebar />}
        </div>
      </div>
    </>
  );
}
