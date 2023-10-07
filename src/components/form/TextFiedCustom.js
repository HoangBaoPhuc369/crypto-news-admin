/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
import React from 'react';
import { TextField } from '@mui/material';
import { Controller, get } from 'react-hook-form';
import _ from 'lodash';

const TextFiedCustom = ({
  hookForm: {
    formState: { errors },
    control,
  },
  label,
  name = '',
  highlight = false,
  ...otherProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          error={get(errors, name)}
          helperText={_.get(get(errors, name), 'message', '')}
          {...otherProps}
          label={label}
          id={name}
          name={name}
          sx={{
            ...otherProps.sx,
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: highlight ? '#ffc20e !important' : 'inherit',
            },
            '.Mui-disabled': {
              color: highlight ? '#ffc20e !important' : '',
            },
          }}
        />
      )}
    />
  );
};

export default TextFiedCustom;
