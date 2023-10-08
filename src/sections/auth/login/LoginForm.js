/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
// components
import Iconify from '../../../components/iconify';
import TextFiedCustom from '../../../components/form/TextFiedCustom';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function LoginForm({ onSubmit, loading }) {
  
  const [showPassword, setShowPassword] = useState(false);

  const hookForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const checkObjectProperties = (obj) => _.every(_.values(obj), (value) => !_.isEmpty(value));

  const handleClick = (data) => {
    if (checkObjectProperties(data)) {
      onSubmit(data);
    } else {
      console.log('Có ít nhất một thuộc tính không có giá trị');
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextFiedCustom name="email" label="Email address" hookForm={hookForm} />

        <TextFiedCustom
          hookForm={hookForm}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={loading}
        onClick={() => hookForm.handleSubmit(handleClick)()}
      >
        Login
      </LoadingButton>
    </>
  );
}
