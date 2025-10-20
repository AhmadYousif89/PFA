import { cn } from "@/lib/utils";
import SpinnerIcon from "public/assets/images/icon-spinner.svg";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <SpinnerIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
export { Spinner };
