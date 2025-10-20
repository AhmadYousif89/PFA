"use client";

import { useState } from "react";

export const useNameInput = (defaultValue: string = "", maxLength: number = 30) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(false);

  const remainingChars = maxLength - value.trim().length;
  const hasValidLength =
    value.trim().length > 0 && value.trim().length <= maxLength && remainingChars >= 0;

  const isValid = !error || hasValidLength;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleInvalid = (
    e: React.InvalidEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>,
    errorMessage: string,
  ) => {
    setError(true);
    e.currentTarget.setCustomValidity(errorMessage);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    const trimmed = inputValue.trim();
    const remaining = maxLength - trimmed.length;

    if (trimmed.length === 0) {
      setError(true);
      e.currentTarget.setCustomValidity("Name cannot be empty");
    } else if (remaining < 0) {
      setError(true);
      e.currentTarget.setCustomValidity(`Name must be ${maxLength} characters or less`);
    } else {
      setError(false);
      e.currentTarget.setCustomValidity("");
    }
  };

  return {
    value,
    error,
    isValid,
    remainingChars: remainingChars >= 0 ? remainingChars : 0,
    handleValueChange,
    handleInvalid,
    handleInput,
  };
};
