import { memo } from "react";
import { CustomInput } from "@/components/custom.input";
import { useNameInput } from "@/hooks/use-name-input";

type PotNameInputProps = {
  id: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  maxLength?: number;
  placeholder?: string;
  showCharCount?: boolean;
};

export const PotNameInput = memo(
  ({
    id,
    name,
    required = false,
    defaultValue = "",
    maxLength = 30,
    placeholder = "e.g. Rainy Days",
    showCharCount = true,
  }: PotNameInputProps) => {
    const { value, isValid, remainingChars, handleValueChange, handleInvalid, handleInput } =
      useNameInput(defaultValue, maxLength);

    return (
      <div className="flex flex-col gap-1">
        <CustomInput
          id={id}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          inputIsValid={isValid}
          onInput={handleInput}
          onValueChange={handleValueChange}
          title="Enter a name for the pot"
          onInvalid={(e) =>
            handleInvalid(
              e,
              value.trim().length === 0
                ? "Name cannot be empty"
                : `Name must be ${maxLength} characters or less`,
            )
          }
        />
        {showCharCount && (
          <span className="text-muted-foreground self-end text-right text-xs">
            {remainingChars} characters left
          </span>
        )}
      </div>
    );
  },
);

PotNameInput.displayName = "PotNameInput";
