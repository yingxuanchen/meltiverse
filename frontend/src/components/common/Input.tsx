import { TextField } from "@mui/material";
import React, { ChangeEventHandler } from "react";

interface Props {
  label: string;
  type: string;
  name: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  errorMessage: string;
  isValid: boolean;
  value: string;
}

function Input(props: Props) {
  const { label, type, name, handleChange, errorMessage, isValid, value } =
    props;

  return (
    <TextField
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      error={!isValid && errorMessage !== ""}
      helperText={!isValid ? errorMessage : null}
      size="small"
    />
  );
}

export default React.memo(Input);
