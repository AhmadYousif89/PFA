"use client";

import { memo } from "react";
import { CustomInput } from "@/components/custom.input";
import { useCurrencyInput } from "@/hooks/use-currency-input";

type PotTargetInputProps = {
  id: string;
  name: string;
  required?: boolean;
  defaultValue?: number | string;
  onValueChange?: (value: string) => void;
};

export const PotTargetInput = memo(
  ({ id, name, required = false, defaultValue = "", onValueChange }: PotTargetInputProps) => {
    const { value, isValid, handleValueChange, handleInvalid, handleInput } = useCurrencyInput({
      defaultValue,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      handleValueChange(e);
      onValueChange?.(newValue);
    };

    return (
      <CustomInput
        id={id}
        name={name}
        value={value}
        required={required}
        inputIsValid={isValid}
        onInput={handleInput}
        onValueChange={handleChange}
        title="Enter a valid amount, e.g. 2000 or 2000.00"
        onInvalid={(e) => handleInvalid(e, "Please enter a valid target amount")}
      />
    );
  },
);

PotTargetInput.displayName = "PotTargetInput";
