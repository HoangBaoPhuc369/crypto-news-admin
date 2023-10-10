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
import CategoryApiService from '../services/api-services/category.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export default function CategoryNew() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const hookForm = useForm({
    defaultValues: {
      name: '',
    },
  });

  const mCreateCategory = useMutation((data) => CategoryApiService.createCategory(data), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      navigate('/dashboard/category');
    },
  });

  const handleCreateCategory = (data) => {
    mCreateCategory.mutate({ data, token: _.get(user, 'token', '') });
  };

  return (
    <>
      <Helmet>
        <title> Category New | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create a new category
          </Typography>
        </Stack>

        <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '20px', marginBottom: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextFiedCustom hookForm={hookForm} name="name" label={'Name'} />
            </Grid>
          </Grid>
        </Paper>
        <Button variant="contained" color="primary" onClick={() => hookForm.handleSubmit(handleCreateCategory)()}>
          Create Category
        </Button>
      </Container>
    </>
  );
}
