import { CustomInput } from "@/components/custom.input";
import { useCurrencyInput } from "@/hooks/use-currency-input";

export const TransactionAmountInput = () => {
  const { value, handleInput, handleInvalid, handleValueChange, isValid } = useCurrencyInput({
    allowNegative: true,
  });

  return (
    <CustomInput
      required
      id="transaction-amount"
      name="amount"
      value={value}
      inputIsValid={isValid}
      onInput={handleInput}
      onValueChange={handleValueChange}
      title="Enter the transaction amount"
      placeholder="e.g. 2500.00"
      onInvalid={(e) => handleInvalid(e, "A valid amount is required")}
    />
  );
};
