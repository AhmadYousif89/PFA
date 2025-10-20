import { CustomInput } from "@/components/custom.input";
import { useNameInput } from "@/hooks/use-name-input";

export const TransactionNameInput = () => {
  const { value, handleInput, handleInvalid, handleValueChange, isValid } = useNameInput();

  return (
    <CustomInput
      required
      id="transaction-name"
      name="name"
      value={value}
      inputIsValid={isValid}
      onInput={handleInput}
      onValueChange={handleValueChange}
      title="Enter the transaction name"
      placeholder="e.g. Living expenses"
      onInvalid={(e) => handleInvalid(e, "Transaction name is required")}
    />
  );
};
