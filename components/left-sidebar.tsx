"use client";

import {
  Hand,
  Square,
  Brush,
  Eraser,
  Sparkles,
  Image as ImageIcon,
  Maximize,
  Delete,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GridItem from "@/components/grid-item";
import { filters, ratios, ToolType } from "@/lib/constants";
import { ToolButton } from "@/components//tool-button";
import { useEditorStore } from "@/store/useEditorState";

export const LeftSidebar = () => {
  const {
    applyFilter,
    isLoading,
    applyExpansion,
    setSelectedTool,
    selectedTool,
    setBrushSize,
    brushSize,
  } = useEditorStore();

  return (
    <aside className="hidden md:flex w-80 flex-col border-r border-zinc-800 bg-zinc-950/50 z-20 shrink-0 h-full">
      <ScrollArea className="h-full w-full">
        <div className="p-4 space-y-6">
          {/* 1. Tools Grid */}
          <div className="px-4 space-y-2 bg-zinc-800/50 p-3 rounded-xl">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Tools
            </h3>
            <Separator className="bg-zinc-800" />

            <div className="grid grid-cols-4 gap-2">
              <ToolButton
                active={selectedTool === ToolType.MOVE}
                onClick={() => {
                  setSelectedTool(ToolType.MOVE);
                }}
                icon={<Hand size={18} />}
                label="Pan"
              />
              <ToolButton
                active={selectedTool === ToolType.RECTANGLE}
                onClick={() => {
                  setSelectedTool(ToolType.RECTANGLE);
                }}
                icon={<Square size={18} />}
                label="Select"
              />
              <ToolButton
                active={selectedTool === ToolType.BRUSH}
                onClick={() => {
                  setSelectedTool(ToolType.BRUSH);
                }}
                icon={<Brush size={18} />}
                label="Brush"
              />
              <ToolButton
                active={selectedTool === ToolType.ERASER}
                onClick={() => {
                  setSelectedTool(ToolType.ERASER);
                }}
                icon={<Eraser size={18} />}
                label="Erase"
              />
            </div>

            {/* 2. Brush Size */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Size
                </h3>
                <span className="text-xs font-mono text-zinc-200 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                  10px
                </span>
              </div>

              {/* Custom styled slider to force yellow theme regardless of global primary color */}
              <Slider
                defaultValue={[brushSize]}
                max={100}
                min={5}
                step={1}
                onValueChange={(value) => {
                  setBrushSize(value[0]);
                }}
                className="py-2 [&>.relative>.absolute]:bg-yellow-500 **:[[role=slider]]:border-yellow-500 **:[[role=slider]]:bg-zinc-950 **:[[role=slider]]:ring-offset-zinc-950 **:[[role=slider]]:focus-visible:ring-yellow-500"
              />
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* 3. AI Accordions */}
          <div className="px-4 space-y-2 bg-zinc-800/50 p-3 rounded-xl">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Options
            </h3>

            <Separator className="bg-zinc-800" />

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="options">
              {/* Item 1: Editing Options */}
              <AccordionItem
                value="options"
                className="border-zinc-800">
                <AccordionTrigger className="text-zinc-200 hover:text-yellow-500 hover:no-underline py-3 transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="text-sm">
                      AI Editing Options
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <GridItem
                      icon={Delete}
                      label={"Remove Background"}
                      // desc={"clear background"}
                      onClick={() => {}}
                      disabled={true}
                    />
                    <GridItem
                      icon={Sparkles}
                      label={"AI Refreshment"}
                      desc={""}
                      onClick={() => {}}
                      disabled={true}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Item 2: AI Filters */}
              <AccordionItem
                value="filters"
                className="border-zinc-800">
                <AccordionTrigger className="text-zinc-200 hover:text-yellow-500 hover:no-underline py-3 transition-colors">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    <span className="text-sm">
                      AI Filters
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {filters.map((item, index) => {
                      return (
                        <GridItem
                          key={index}
                          image={item.image}
                          label={item.name}
                          desc={item.prompt}
                          onClick={() => {
                            applyFilter(item.prompt);
                          }}
                          disabled={isLoading}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Item 3: AI Expansion */}
              <AccordionItem
                value="expansion"
                className="border-none">
                <AccordionTrigger className="text-zinc-200 hover:text-yellow-500 hover:no-underline py-3 transition-colors">
                  <div className="flex items-center gap-2">
                    <Maximize size={16} />
                    <span className="text-sm">
                      AI Expansion
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {ratios.map((r) => (
                      <GridItem
                        key={r.label}
                        icon={r.icon}
                        label={r.label}
                        desc={r.desc}
                        onClick={() => {
                          applyExpansion(r.aspectRatio);
                        }}
                        disabled={false}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
