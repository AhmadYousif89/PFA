import { CustomInput } from "@/components/custom.input";
import { useCurrencyInput } from "@/hooks/use-currency-input";

type MaxSpendingInputProps = {
  id: string;
  name: string;
  required?: boolean;
  defaultValue?: number | string;
};

export const MaxSpendingInput = ({
  id,
  name,
  required = false,
  defaultValue = "",
}: MaxSpendingInputProps) => {
  const { value, isValid, handleValueChange, handleInvalid, handleInput } = useCurrencyInput({
    defaultValue,
  });

  return (
    <CustomInput
      id={id}
      name={name}
      value={value}
      required={required}
      inputIsValid={isValid}
      onInput={handleInput}
      onValueChange={handleValueChange}
      title="Enter a valid amount, e.g. 2000 or 2000.00"
      onInvalid={(e) => handleInvalid(e, "Please enter a valid spending amount")}
    />
  );
};
