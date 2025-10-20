import { memo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type CustomInputProps = {
  inputIsValid: boolean;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInvalid: (e: React.InvalidEvent<HTMLInputElement>) => void;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const CustomInput = memo(
  ({
    className,
    type = "text",
    placeholder = "$   e.g 2000",
    inputIsValid = true,
    onValueChange,
    onInvalid,
    onInput,
    ...props
  }: CustomInputProps) => {
    return (
      <Input
        type={type}
        placeholder={placeholder}
        className={cn("border-border", className)}
        aria-invalid={!inputIsValid}
        onChange={onValueChange}
        onInvalid={onInvalid}
        onInput={onInput}
        {...props}
      />
    );
  },
);

CustomInput.displayName = "CustomInput";
