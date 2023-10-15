/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import { Chip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import * as React from 'react';
import { get, UseFormReturn } from 'react-hook-form';
import { useQuery } from 'react-query';
import { matchSorter } from 'match-sorter';

export default function SelectFieldMultiple({
  hookForm: {
    register,
    setValue,
    watch,
    reset,
    formState: { errors, touchedFields },
  },
  label,
  name,
  required,
  api,
  fieldLabel = 'name',
  fieldSearch = 'keyword',
  fieldId = 'id',
  options = [],
  freeSolo = false,
  processOptions = (ops) => ops,
  isSearchApi = true,
  ...ortherProps
}) {
  const [open, setOpen] = React.useState(false);

  // const filterOptions = (optionss, { inputValue }) => {
  //   return optionss.filter(
  //     (option) =>
  //       _.get(option, 'name', '').toLowerCase().includes(inputValue.toLowerCase()) ||
  //       _.get(option, 'id', '').includes(inputValue)
  //   );
  // };

  const filterOptions = (options, { inputValue }) => matchSorter(options, inputValue);

  return (
    <Autocomplete
      id={name}
      fullWidth
      open={open}
      multiple
      freeSolo
      autoSelect
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      filterOptions={filterOptions}
      onChange={(event, values, reson, details) => {
        setValue(name, values, { shouldValidate: true });
      }}
      options={options.map((option) => _.get(option, 'name'))}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => <Chip key={index} variant="filled" label={option} {...getTagProps({ index })} />)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          error={get(errors, name)}
          helperText={_.get(get(errors, name), 'message', '')}
          label={label}
        />
      )}
      noOptionsText="Không có dữ liệu"
      loadingText="Đang tải dữ liệu . . ."
      {...ortherProps}
    />
  );
}
