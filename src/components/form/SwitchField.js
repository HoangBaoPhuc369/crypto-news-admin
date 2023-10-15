/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
import { FormControlLabel, FormHelperText, Switch } from '@mui/material';
import _ from 'lodash';

const SwitchField = ({
  hookForm: {
    register,
    watch,
    formState: { errors, touchedFields },
  },
  label,
  name = '',
  sxLabel,
  ...otherProps
}) => {
  return (
    <>
      <FormControlLabel
        id={name}
        control={
          <Switch
            {...register(name)}
            // onChange={(e, v) => setValue(name, v)}
            name={name}
            checked={Boolean(watch(name))}
            {...otherProps}
          />
        }
        sx={{
          alignItems: 'center',
          height: '100%',
          ...sxLabel,
        }}
        label={label}
      />
      {touchedFields[name] && _.get(errors[name], 'message', '') && (
        <FormHelperText error id={`${name}--error`}>
          {errors[`${name}`]}
        </FormHelperText>
      )}
    </>
  );
};

export default SwitchField;
