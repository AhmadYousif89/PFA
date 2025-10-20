import { useEffect } from "react";
import { Dialog } from "../ui/dialog";

type Props = { isOpen: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode };

export const BaseModal = ({ isOpen, onOpenChange = () => {}, children }: Props) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
};
