"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportMenuProps {
  onExportCSV: () => void;
}

export function ExportMenu({ onExportCSV }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="h-8 px-3 text-xs border-zinc-200"
      >
        <Download className="size-3 mr-1.5" />
        Export
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 w-36 rounded-lg border border-zinc-200 bg-white shadow-md py-1">
          <button
            onClick={() => { onExportCSV(); setOpen(false); }}
            className="w-full px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-50"
          >
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}
