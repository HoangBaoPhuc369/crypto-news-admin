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
import TextFiedCustom from '../components/form/TextFiedCustom';
import SelectField from '../components/form/SelectField';
import { useMutation } from 'react-query';
import AuthApiService from '../services/api-services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export default function UserNew() {
  const navigate = useNavigate();
  const {user} = useSelector(state => state.auth)

  const hookForm = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      roles: ["system"],
      active: true,
    },
  });

  const mCreateUser = useMutation((data) => AuthApiService.createUser(data), {
    onError: (err) => {
       console.log(err)
    },
    onSuccess: (data) => {
      navigate('/dashboard/user')
    }
});

  const handleCreateUser = (data) => {
    // console.log(user);
    const params = _.omit(data, 'activeHideObj');
    console.log(_.get(user, 'token', ''));
    mCreateUser.mutate({data:params, token: _.get(user, 'token', '')});
  };

  return (
    <>
      <Helmet>
        <title> User New | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create a new user
          </Typography>
        </Stack>

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
        <Button variant="contained" color="primary" onClick={() => hookForm.handleSubmit(handleCreateUser)()}>
          Create User
        </Button>
      </Container>
    </>
  );
}
