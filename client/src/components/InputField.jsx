import React from "react";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

export default function InputField({ name, value, fieldName, onChange }) {
  return (
    <div className="inputFieldItem">
      <div className="inputLabel">{fieldName}</div>
      <TextField
        variant="outlined"
        name={name}
        value={value}
        onChange={onChange}
        color="default"
        size="small"
        fullWidth
        InputProps={{ style: { fontSize: 12 } }}
      />
    </div>
  );
}
