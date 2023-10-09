/* eslint-disable import/order */
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Grid,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import TextFiedCustom from '../form/TextFiedCustom';
import SelectField from '../form/SelectField';
import { useMutation } from 'react-query';
import AuthApiService from '../../services/api-services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export default function UserUpdate({ data, close, refetch, userId }) {
  const { user } = useSelector((state) => state.auth);
  console.log(data);
  const hookForm = useForm({
    defaultValues: {
      email: _.get(data, 'email', ''),
      password: _.get(data, 'password', ''),
      name: _.get(data, 'name', ''),
      roles: ['system'],
      active: _.get(data, 'active', false),
    },
  });

  const mUpdateUser = useMutation((data) => AuthApiService.updateUser(data), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      refetch();
      close();
    },
  });

  const handleUpdateUser = (data) => {
    // console.log(user);
    const params = _.omit(data, ['activeHideObj', 'active', 'roles']);
    mUpdateUser.mutate({ data: params, token: _.get(user, 'token', ''), userId });
  };

  return (
    <>
      <Helmet>
        <title> User Update | Minimal UI </title>
      </Helmet>

      <Container>
        <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '20px', marginBottom: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextFiedCustom hookForm={hookForm} name="name" label={'Name'} />
            </Grid>
            <Grid item xs={6}>
              <TextFiedCustom hookForm={hookForm} name="password" label={'Password'} />
            </Grid>
            <Grid item xs={6}>
              <TextFiedCustom hookForm={hookForm} name="email" label={'Email'} />
            </Grid>
            <Grid item xs={6}>
              {/* <TextFiedCustom hookForm={hookForm} name="role" label={'Role'} /> */}
            </Grid>
            <Grid item xs={6}>
              <SelectField
                hookForm={hookForm}
                name="active"
                label={'Active'}
                options={[
                  {
                    id: true,
                    name: 'active',
                  },
                  {
                    id: false,
                    name: 'banned',
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Paper>
        <Button variant="contained" color="primary" onClick={() => hookForm.handleSubmit(handleUpdateUser)()}>
          Update User
        </Button>
      </Container>
    </>
  );
}
