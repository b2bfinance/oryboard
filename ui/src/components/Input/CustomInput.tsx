import * as React from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';

function generateSlotProps({
  readOnly,
  step,
  startAdornment,
  startAdornmentString,
  endAdornment,
  endAdornmentString,
} : {
  readOnly?: boolean
  step?: number
  startAdornment?: React.ElementType
  startAdornmentString?: string;
  endAdornment?: React.ElementType
  endAdornmentString?: string;
}): object {
  const input: any = {};

  if (readOnly) {
    input.readOnly = true;
  }

  if (step) {
    input.step = `${step}`;
  }

  if (startAdornment) {
    input.startAdornment = startAdornment;
  } else if (startAdornmentString) {
    input.startAdornment = <InputAdornment position="start">{startAdornmentString}</InputAdornment>
  }

  if (endAdornment) {
    input.endAdornment = endAdornment;
  } else if (endAdornmentString) {
    input.endAdornment = <InputAdornment position="end">{endAdornmentString}</InputAdornment>
  }

  return {input}
}

export const CurrencyInput: React.FunctionComponent<{
  value: string | number | undefined,
  readOnly?: boolean,
  setValue?: (arg0: number) => void
  id?: string | undefined;
  name?: string | undefined;
  uncontrolled?: boolean;
}> = ({value, readOnly, setValue, name, id, uncontrolled}) => {
  value = Math.ceil(+(value || 0))

  if (uncontrolled) {
    return <TextField
        type="number"
        defaultValue={value}
        onChange={(e: any) => setValue && setValue(+(e.target.value||0))}
        slotProps={generateSlotProps({readOnly, startAdornmentString: "£"})}
        name={name}
        id={id}
        size="small"
      />
  }

  return <TextField
    type="number"
    value={value}
    onChange={(e: any) => setValue && setValue(+(e.target.value||0))}
    slotProps={generateSlotProps({readOnly, startAdornmentString: "£"})}
    name={name}
    id={id}
    size="small"
  />
}

export const RateInput: React.FunctionComponent<{
  name?: string,
  value: string | number,
  readOnly?: boolean,
  setValue?: (arg0: number) => void
}> = ({name, value, readOnly, setValue}) => {

  return <TextField
    name={name}
    type="number"
    value={value}
    onChange={(e: any) => setValue && setValue(+(e.target.value||0))}
    slotProps={generateSlotProps({readOnly, step: 0.01, endAdornmentString: "%"})}
    size="small"
  />
}

export const NumberInput: React.FunctionComponent<{
  name?: string,
  value: string | number,
  readOnly?: boolean,
  setValue?: (arg0: number) => void
}> = ({name, value, readOnly, setValue}) => {
  return <TextField
    name={name}
    type="number"
    value={value}
    onChange={(e: any) => setValue && setValue(+(e.target.value||0))}
    slotProps={generateSlotProps({readOnly, step: 0.01})}
    size="small"
  />
}
