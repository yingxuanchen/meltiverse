import { ChangeEventHandler } from "react";
import Input from "../components/common/Input";
import { requiredRule, dateFormatRule } from "./inputValidationRules";
import { Material } from "../types/types";
import { formatDateString } from "./utils";

/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - input name
 * @param {string} type - input type
 * @param {string} defaultValue - default value for the input
 */
function createFormFieldConfig(
  label: string,
  name: string,
  type: string,
  defaultValue: string,
  hasValidationRule: boolean
) {
  return {
    renderInput: (
      handleChange: ChangeEventHandler<HTMLInputElement>,
      value: string,
      isValid: boolean,
      error: string,
      key: any
    ) => {
      return (
        <Input
          key={key}
          name={name}
          type={type}
          label={label}
          isValid={isValid}
          value={value}
          handleChange={handleChange}
          errorMessage={error}
        />
      );
    },
    label,
    value: defaultValue,
    valid: defaultValue ? true : hasValidationRule ? false : true,
    errorMessage: "",
    touched: false,
  };
}

// object representation of Material form
export const materialForm = (material: Material | null) => {
  return {
    postedDate: {
      ...createFormFieldConfig(
        "Posted Date",
        "postedDate",
        "text",
        material?.postedDate ? formatDateString(material.postedDate) : "",
        true
      ),
      validationRules: [
        requiredRule("Posted Date"),
        dateFormatRule("Posted Date"),
      ],
    },
    author: {
      ...createFormFieldConfig(
        "Author",
        "author",
        "text",
        material?.author ?? "",
        true
      ),
      validationRules: [requiredRule("Author")],
    },
    title: {
      ...createFormFieldConfig(
        "Title",
        "title",
        "text",
        material?.title ?? "",
        true
      ),
      validationRules: [requiredRule("Title")],
    },
    url: {
      ...createFormFieldConfig("Url", "url", "url", material?.url ?? "", true),
      validationRules: [requiredRule("Url")],
    },
    topic: {
      ...createFormFieldConfig(
        "Topic",
        "topic",
        "text",
        material?.topic ?? "",
        false
      ),
      validationRules: [],
    },
  };
};
