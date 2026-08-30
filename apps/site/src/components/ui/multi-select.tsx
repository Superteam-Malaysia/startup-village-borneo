"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: MultiSelectOption[];
  onChange: (selected: MultiSelectOption[]) => void;
  onCreateNew?: (name: string) => Promise<MultiSelectOption | null>;
  placeholder?: string;
  allowCreate?: boolean;
  /** When true, dropdown renders in a portal so it can overflow outside modals */
  dropdownInPortal?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  onCreateNew,
  placeholder = "Search...",
  allowCreate = true,
  dropdownInPortal = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!dropdownInPortal || !isOpen || !containerRef.current) return;
    function updatePosition() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(containerRef.current);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, dropdownInPortal]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedIds = new Set(selected.map((s) => s.id));
  const filtered = options.filter(
    (o) =>
      !selectedIds.has(o.id) &&
      o.name.toLowerCase().includes(search.toLowerCase())
  );
  const exactMatch = options.some(
    (o) => o.name.toLowerCase() === search.toLowerCase()
  );
  const showCreate = allowCreate && search.trim() && !exactMatch && onCreateNew;

  function handleSelect(option: MultiSelectOption) {
    onChange([...selected, option]);
    setSearch("");
    inputRef.current?.focus();
  }

  function handleRemove(id: string) {
    onChange(selected.filter((s) => s.id !== id));
  }

  async function handleCreate() {
    if (!onCreateNew || !search.trim()) return;
    setIsCreating(true);
    const newOption = await onCreateNew(search.trim());
    if (newOption) {
      onChange([...selected, newOption]);
    }
    setSearch("");
    setIsCreating(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex flex-wrap gap-1.5 min-h-[40px] w-full rounded-md border bg-[#171717] px-3 py-2 text-sm cursor-text",
          isOpen ? "border-ring ring-2 ring-ring" : "border-border/50"
        )}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs text-white"
          >
            {item.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item.id);
              }}
              className="hover:text-destructive cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground"
        />
      </div>

      {isOpen && (filtered.length > 0 || showCreate) && (() => {
        const dropdownContent = (
          <div
            className={cn(
              "rounded-md border border-white/10 bg-[#080B0E] shadow-lg max-h-48 overflow-y-auto",
              dropdownInPortal ? "" : "absolute z-50 mt-1 w-full"
            )}
            style={dropdownInPortal ? dropdownStyle : undefined}
          >
            {filtered.length === 0 && !showCreate && (
              <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <Search className="w-3 h-3" />
                No results found
              </div>
            )}
            {filtered.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                {option.name}
              </button>
            ))}
            {showCreate && (
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-white/10 cursor-pointer transition-colors flex items-center gap-2 border-t border-white/5"
              >
                <Plus className="w-3 h-3" />
                {isCreating ? "Creating..." : `Create "${search.trim()}"`}
              </button>
            )}
          </div>
        );
        return dropdownInPortal && typeof document !== "undefined"
          ? createPortal(dropdownContent, document.body)
          : dropdownContent;
      })()}
    </div>
  );
}
