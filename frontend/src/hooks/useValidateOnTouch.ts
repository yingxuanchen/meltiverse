import { useState, useCallback, ChangeEvent } from "react";
import { ValidationRule } from "../utils/inputValidationRules";

function useValidateOnTouch(
  initialValue: string,
  validationRules: ValidationRule[]
) {
  const [errorMessage, setErrorMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState(initialValue);

  const isInputFieldValid = useCallback(
    (value: string) => {
      for (const rule of validationRules) {
        if (!rule.validate(value)) {
          setErrorMessage(rule.message);
          return false;
        }
      }
      return true;
    },
    [validationRules]
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      // update value
      const trimmed = value.trim();
      setValue(trimmed);

      // update input field's validity
      const isValidInput = isInputFieldValid(trimmed);
      // if input is valid and it was previously set to invalid
      // set its valid status to true
      if (isValidInput && !valid) {
        setValid(true);
      } else if (!isValidInput && valid) {
        // if input is not valid and it was previously valid
        // set its valid status to false
        setValid(false);
      }

      // mark input field as touched
      setTouched(true);
    },
    [isInputFieldValid, valid]
  );

  return { value, errorMessage, onChange: onInputChange, isInputValid: valid };
}

export default useValidateOnTouch;
