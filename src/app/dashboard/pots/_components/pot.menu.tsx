"use client";

import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pot, ThemeColor } from "@/lib/types";

import { EditPotModal } from "./edit.modal";
import { DeletePotModal } from "./delete.modal";
import EllipsisIcon from "public/assets/images/icon-ellipsis.svg";

type PotMenuProps = {
  pot: Pot;
  selectedThemes: ThemeColor[];
};

export function PotDropdownMenu({ pot, selectedThemes }: PotMenuProps) {
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
            <span className="sr-only">Open Pot Menu</span>
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
            Edit Pot
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
            Delete Pot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPotModal
        pot={pot}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
        selectedThemes={selectedThemes}
      />
      <DeletePotModal pot={pot} open={deleteOpen} onOpenChange={handleDeleteOpenChange} />
    </>
  );
}
