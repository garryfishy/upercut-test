import {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from "@mui/material";
import { JSX } from "react/jsx-runtime";

export function Input(
  props: JSX.IntrinsicAttributes & {
    variant?: TextFieldVariants | undefined;
  } & Omit<
      FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
      "variant"
    >
) {
  return (
    <TextField
      {...props}
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
      }}
    />
  );
}
