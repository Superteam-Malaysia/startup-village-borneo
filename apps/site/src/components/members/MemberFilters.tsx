"use client";

import { SlidersHorizontal, RotateCcw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { SubskillTag } from "@/lib/types";

interface MemberFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOptions?: string[];
  subskillOptions?: SubskillTag[];
  selectedSubskillIds: string[];
  onSubskillChange: (ids: string[]) => void;
}

const defaultFilters = [
  "All",
  "Core Team",
  "Frontend",
  "Backend",
  "Blockchain",
  "Design",
  "Content",
  "Growth",
  "Community",
];

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer shrink-0 px-4 md:py-2.5 py-2 md:rounded-lg rounded-md md:text-sm text-[12px] font-medium transition-all duration-200 whitespace-nowrap ${
        isActive
          ? "bg-solana-purple text-white"
          : "bg-surface/50 text-muted hover:text-white hover:bg-surface border border-white/5"
      }`}
    >
      {label}
    </button>
  );
}

export function MemberFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  filterOptions,
  subskillOptions = [],
  selectedSubskillIds,
  onSubskillChange,
}: MemberFiltersProps) {
  const filters = filterOptions || defaultFilters;
  const hasSubskills = subskillOptions.length > 0;
  const selectedSet = new Set(selectedSubskillIds);

  const handleSubskillToggle = (id: string, checked: boolean) => {
    if (checked) {
      onSubskillChange([...selectedSubskillIds, id]);
    } else {
      onSubskillChange(selectedSubskillIds.filter((x) => x !== id));
    }
  };

  return (
    <div className="md:space-y-6 space-y-4">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search by name, role, company, or subskill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-5 md:py-3.5 py-2 md:rounded-xl rounded-md bg-surface/50 border border-white/5 text-white placeholder-muted-dark focus:outline-none focus:border-solana-purple/30 focus:ring-1 focus:ring-solana-purple/20 transition-all text-sm pr-10"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 md:w-5 md:h-5 w-4 h-4 text-muted-dark pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Mobile: combined filters dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Filters"
              className={cn(
                "md:hidden relative cursor-pointer shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200",
                activeFilter !== "All" || selectedSubskillIds.length > 0
                  ? "bg-solana-purple/20 text-solana-purple border-solana-purple/40"
                  : "bg-surface/50 text-muted hover:text-white hover:bg-surface border-white/5"
              )}
            >
              <Filter className="w-4 h-4" />
              {(activeFilter !== "All" || selectedSubskillIds.length > 0) && (
                <span className="absolute -top-1 -right-1 bg-solana-purple text-white text-[10px] font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {(activeFilter !== "All" ? 1 : 0) + selectedSubskillIds.length}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="flex flex-col p-0 max-h-[70vh] bg-[#080B0E] border-white/10 text-white w-64 overflow-hidden"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="shrink-0 p-2 border-b border-white/10">
              <DropdownMenuLabel className="text-muted-dark text-xs uppercase tracking-wider px-2">
                Category
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={activeFilter}
                onValueChange={onFilterChange}
              >
                {filters.map((filter) => (
                  <DropdownMenuRadioItem
                    key={filter}
                    value={filter}
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    {filter}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </div>
            {hasSubskills && (
              <>
                <DropdownMenuSeparator className="bg-white/10" />
                <div className="flex-1 min-h-0 overflow-y-auto p-2">
                  <DropdownMenuLabel className="text-muted-dark text-xs uppercase tracking-wider px-2 mb-1">
                    Subskills
                  </DropdownMenuLabel>
                  {subskillOptions.map((subskill) => (
                    <DropdownMenuCheckboxItem
                      key={subskill.id}
                      checked={selectedSet.has(subskill.id)}
                      onCheckedChange={(checked) =>
                        handleSubskillToggle(subskill.id, checked === true)
                      }
                      onSelect={(e) => e.preventDefault()}
                      className={cn(
                        "cursor-pointer focus:bg-white/10 focus:text-white",
                        "data-[state=unchecked]:before:absolute data-[state=unchecked]:before:left-2 data-[state=unchecked]:before:top-1/2 data-[state=unchecked]:before:-translate-y-1/2 data-[state=unchecked]:before:size-4 data-[state=unchecked]:before:rounded data-[state=unchecked]:before:border data-[state=unchecked]:before:border-white/40 data-[state=unchecked]:before:pointer-events-none"
                      )}
                    >
                      {subskill.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </>
            )}
            {hasSubskills && (
              <div className="shrink-0 border-t border-white/10 p-1">
                <DropdownMenuItem
                  onClick={() => onSubskillChange([])}
                  className="cursor-pointer focus:bg-white/10 focus:text-white text-muted hover:text-white rounded-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset subskills
                </DropdownMenuItem>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop: subskill filter icon - same row as search */}
        {hasSubskills && (
          <div className="hidden md:block shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Filter by subskill"
                  className={cn(
                    "relative cursor-pointer shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-all duration-200",
                    selectedSubskillIds.length > 0
                      ? "bg-solana-purple/20 text-solana-purple border-solana-purple/40"
                      : "bg-surface/50 text-muted hover:text-white hover:bg-surface border-white/5"
                  )}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {selectedSubskillIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-solana-purple text-white text-[10px] font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {selectedSubskillIds.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="flex flex-col p-0 max-h-64 bg-[#080B0E] border-white/10 text-white w-56 overflow-hidden"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <div className="flex-1 min-h-0 overflow-y-auto p-1">
                  {subskillOptions.map((subskill) => (
                    <DropdownMenuCheckboxItem
                      key={subskill.id}
                      checked={selectedSet.has(subskill.id)}
                      onCheckedChange={(checked) =>
                        handleSubskillToggle(subskill.id, checked === true)
                      }
                      onSelect={(e) => e.preventDefault()}
                      className={cn(
                        "cursor-pointer focus:bg-white/10 focus:text-white",
                        "data-[state=unchecked]:before:absolute data-[state=unchecked]:before:left-2 data-[state=unchecked]:before:top-1/2 data-[state=unchecked]:before:-translate-y-1/2 data-[state=unchecked]:before:size-4 data-[state=unchecked]:before:rounded data-[state=unchecked]:before:border data-[state=unchecked]:before:border-white/40 data-[state=unchecked]:before:pointer-events-none"
                      )}
                    >
                      {subskill.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <div className="shrink-0 border-t border-white/10 p-1">
                  <DropdownMenuItem
                    onClick={() => onSubskillChange([])}
                    className="cursor-pointer focus:bg-white/10 focus:text-white text-muted hover:text-white rounded-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Desktop: filter chips row */}
      <div className="hidden md:flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            isActive={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
          />
        ))}
      </div>
    </div>
  );
}
