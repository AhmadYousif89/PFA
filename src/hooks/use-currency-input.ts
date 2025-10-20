"use client";

import { useState } from "react";

export const useCurrencyInput = ({
  defaultValue = "",
  allowNegative = false,
}: {
  defaultValue?: number | string;
  allowNegative?: boolean;
}) => {
  const [value, setValue] = useState(String(defaultValue) || "");
  const [error, setError] = useState(false);

  const validateInput = (inputValue: string) => {
    if (inputValue === "") return true;

    const regex = allowNegative ? /^-?\d+(\.\d{1,2})?$/ : /^\d+(\.\d{1,2})?$/;
    return regex.test(inputValue);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleInvalid = (
    e: React.InvalidEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>,
    errorMessage: string,
  ) => {
    setError(true);
    e.currentTarget.setCustomValidity(errorMessage);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setError(false);
    e.currentTarget.setCustomValidity("");
  };

  const isValid = validateInput(value) && !error;

  return {
    value,
    error,
    isValid,
    handleValueChange,
    handleInvalid,
    handleInput,
  };
};
