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
import CategoryApiService from '../../services/api-services/category.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export default function CategoryUpdate({ data, close, refetch, paramId }) {
  const { user } = useSelector((state) => state.auth);
  const hookForm = useForm({
    defaultValues: {
      name: _.get(data, 'name', ''),
    },
  });

  const mUpdateCategory = useMutation((data) => CategoryApiService.updateCategory(data), {
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
    mUpdateCategory.mutate({ data, token: _.get(user, 'token', ''), paramId });
  };

  return (
    <>
      <Helmet>
        <title> Category Update | Minimal UI </title>
      </Helmet>

      <Container>
        <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '20px', marginBottom: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextFiedCustom hookForm={hookForm} name="name" label={'Name'} />
            </Grid>
          </Grid>
        </Paper>
        <Button variant="contained" color="primary" onClick={() => hookForm.handleSubmit(handleUpdateUser)()}>
          Update Category
        </Button>
      </Container>
    </>
  );
}
