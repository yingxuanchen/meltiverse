export interface ValidationRule {
  name: string;
  message: string;
  validate: Function;
}

/**
 * creates and returns a validation rule object that
 * is used by useForm hook to validate the form inputs
 *
 * @param {string} ruleName - name of the validation rule
 * @param {string} errorMessage - message to display
 * @param {function} validateFunc - validation function
 */
function createValidationRule(
  ruleName: string,
  errorMessage: string,
  validateFunc: Function
): ValidationRule {
  return {
    name: ruleName,
    message: errorMessage,
    validate: validateFunc,
  };
}

export function requiredRule(inputName: string) {
  return createValidationRule(
    "required",
    `${inputName} required`,
    (inputValue: string) => inputValue.length !== 0
  );
}

export function dateFormatRule(inputName: string) {
  return createValidationRule(
    "dateFormat",
    `${inputName} should be in yyyy-MM-dd format`,
    (inputValue: string) =>
      /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]$/.test(inputValue)
  );
}

export function timestampFormatRule(inputName: string) {
  return createValidationRule(
    "timestampFormat",
    `${inputName} should only contain digits and :`,
    (inputValue: string) => inputValue === "" || /^[0-9:]+$/.test(inputValue)
  );
}

export function minLengthRule(inputName: string, minCharacters: number) {
  return createValidationRule(
    "minLength",
    `${inputName} should contain atleast ${minCharacters} characters`,
    (inputValue: string) => inputValue.length >= minCharacters
  );
}

export function maxLengthRule(inputName: string, maxCharacters: number) {
  return createValidationRule(
    "minLength",
    `${inputName} cannot contain more than ${maxCharacters} characters`,
    (inputValue: string) => inputValue.length <= maxCharacters
  );
}

export function passwordMatchRule() {
  return createValidationRule(
    "passwordMatch",
    `passwords do not match`,
    (inputValue: string, formObj: any) => inputValue === formObj.password.value
  );
}
