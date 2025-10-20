import { cn } from "@/lib/utils";
import { Button } from "./button";

import ArrowIcon from "public/assets/images/icon-caret-left.svg";

type SectionProps = {
  title?: string;
  description?: string;
  onBack?: () => void;
  onSkip?: () => void;
} & React.ComponentProps<"section">;

export const Section = ({
  className,
  onBack,
  onSkip,
  title,
  description,
  children,
}: SectionProps) => {
  return (
    <section
      className={cn(
        "absolute inset-0 mx-auto flex max-w-4xl flex-col gap-8 transition-all duration-700 ease-in-out",
        className,
      )}
    >
      {title && (
        <div className="flex flex-col items-start gap-2">
          <div className="mb-8 flex w-full justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground focus-visible:text-primary focus-visible:bg-card focus-visible:hover:bg-card/75 focus-visible:**:fill-primary h-10 w-20 rounded px-1"
            >
              <ArrowIcon className="*:fill-card size-fit" />
              Back
            </Button>
            {onSkip && (
              <Button
                variant="outline"
                onClick={onSkip}
                className="text-muted-foreground hover:bg-orange/75 focus-visible:bg-orange/75 h-10 w-20 rounded px-1"
              >
                Skip
              </Button>
            )}
          </div>
          <h2 className="text-foreground text-xl font-bold">{title}</h2>
          <p className="text-muted-foreground text-md">{description}</p>
        </div>
      )}
      {children}
    </section>
  );
};
