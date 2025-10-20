"use client";

import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Budget, ThemeColor } from "@/lib/types";

import { EditBudgetModal } from "./edit.modal";
import { DeleteBudgetModal } from "./delete.modal";
import EllipsisIcon from "public/assets/images/icon-ellipsis.svg";
import { UserCategory } from "@/app/(auth)/_lib/types";

type BudgetActionsProps = {
  budget: Budget;
  selectedThemes: ThemeColor[];
  selectedCategories: string[];
  availableCategories: UserCategory[];
};

export function BudgetDropdownMenu({
  budget,
  selectedThemes,
  selectedCategories,
  availableCategories,
}: BudgetActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditOpenChange = useCallback((open: boolean) => setEditOpen(open), []);
  const handleDeleteOpenChange = useCallback((open: boolean) => setDeleteOpen(open), []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="data-[state=open]:ring-border text-secondary size-6 items-center justify-center rounded text-base data-[state=open]:ring-[2px]"
          >
            <EllipsisIcon />
            <span className="sr-only">Open Budget Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="px-5 py-3">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
            className="cursor-pointer rounded-sm text-sm"
          >
            Edit Budget
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-muted my-3" />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
            className="cursor-pointer rounded-sm text-sm"
          >
            Delete Budget
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditBudgetModal
        budget={budget}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
        selectedThemes={selectedThemes}
        selectedCategories={selectedCategories}
        availableCategories={availableCategories}
      />
      <DeleteBudgetModal budget={budget} open={deleteOpen} onOpenChange={handleDeleteOpenChange} />
    </>
  );
}
