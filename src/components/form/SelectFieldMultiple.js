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

export default function SelectFieldMultiple({
  hookForm: {
    register,
    setValue,
    watch,
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
  const [inputValue, setInputValue] = React.useState('');

  // const filterOptions = (optionss, { inputValue }) => {
  //   return optionss.filter(
  //     (option) =>
  //       _.get(option, 'name', '').toLowerCase().includes(inputValue.toLowerCase()) ||
  //       _.get(option, 'id', '').includes(inputValue)
  //   );
  // };

  const filterOptions = (options, { inputValue }) => {
    const filteredOptions = options.filter(
      (option) =>
        _.get(option, fieldLabel, '').toLowerCase().includes(inputValue.toLowerCase()) ||
        _.get(option, fieldId, '').includes(inputValue)
    );

    // Kiểm tra nếu giá trị nhập vào không có trong danh sách tùy chọn
    const inputValueExists = options.some((option) => _.get(option, fieldLabel, '') === inputValue);

    // Nếu giá trị nhập vào không có trong danh sách, thêm nó vào danh sách tùy chọn
    if (inputValue && !inputValueExists) {
      filteredOptions.push({ [fieldId]: inputValue, [fieldLabel]: inputValue });
    }

    return filteredOptions;
  };

  return (
    <Autocomplete
      id={name}
      multiple
      fullWidth
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={watch(name) || []}
      isOptionEqualToValue={(option, value) => {
        if (_.isUndefined(value[fieldId])) return false;
        return _.get(option, fieldId, '') === _.get(value, fieldId, '');
      }}
      getOptionLabel={(option) => `${option[fieldId]}`}
      filterOptions={filterOptions}
      onChange={(event, values, reson, details) => {
        setValue(name, values, { shouldValidate: true });
      }}
      options={processOptions(options)}
      freeSolo
      renderOption={(props, option) => {
        const label = _.get(option, fieldId) || option;
        return <li {...props}>{label}</li>;
      }}
      // onKeyDown={(e) => {
      //   if (e.key === 'Enter' || e.key === ' ') {
      //     e.preventDefault();
      //     const trimmedValue = inputValue.trim();
      //     if (trimmedValue && !options.some((option) => option[fieldLabel] === trimmedValue)) {
      //       const newOption = { [fieldLabel]: trimmedValue };
      //       setInputValue('');
      //       // setOptions((prevOptions) => [...prevOptions, newOption]);
      //       // Thực hiện các hành động khác tại đây, ví dụ: gửi giá trị mới lên server
      //     }
      //   }
      // }}
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
