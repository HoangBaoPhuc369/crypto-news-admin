/* eslint-disable arrow-body-style */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Helmet } from 'react-helmet-async';
import _, { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
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
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
// sections
// mock
import { useNavigate } from 'react-router-dom';
import TableDynamic from '../components/form/TableDynamic';
import { useMutation, useQuery } from 'react-query';
import AuthApiService from '../services/api-services/auth.service';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import UserDialog, { baseViewUserDialogRef } from '../components/dialog/UserDialog';
import toastService from '../services/core/toast.service';

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [row, setRow] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const hookForm = useForm({
    defaultValues: {
      rows: [],
      index: 1,
      size: 5,
    },
  });

  const { watch, setValue } = hookForm;

  const qgetListUser = useQuery(
    ['qgetListUser', watch('index'), watch('size'), watch('rows')],
    () =>
      AuthApiService.getListUser({
        data: {
          index: watch('index'),
          size: watch('size'),
        },
        token: _.get(user, 'token'),
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setValue('rows', _.get(data, 'data.data'));
      },
      onError: (err) => {},
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const mDeleteUser = useMutation((data) => AuthApiService.deleteUser({ data, token: _.get(user, 'token', '') }), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      handleCloseMenu();
      qgetListUser.refetch();
      toastService.toast('success', 'Success', 'Delete User Success!');
    },
  });

  const columns = [
    {
      id: 'avatar',
      label: 'Avatar',
      width: 100,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => {
        return (
          <img
            src={_.get(params, 'avatar', '')}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
            alt=""
            loading="lazy"
          />
        );
      },
    },
    {
      id: 'email',
      label: 'Email',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
    },
    {
      id: 'name',
      label: 'Name',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
    },
    {
      id: 'roles',
      label: 'Role',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => {
        const label = _.get(params, 'roles[0]', '') === 'admin' ? 'Admin' : 'Writer';
        return (
          <Label color={(_.get(params, 'roles[0]', '') === 'admin' && 'info') || 'warning'}>
            {sentenceCase(label)}
          </Label>
        );
      },
    },
    {
      id: 'active',
      label: 'Status',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => {
        const label = Boolean(_.get(params, 'active', false)) ? 'active' : 'banned';
        return (
          <Label color={(_.get(params, 'active', false) === false && 'error') || 'success'}>
            {sentenceCase(label)}
          </Label>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => (
        <IconButton
          size="large"
          color="inherit"
          onClick={(e) => {
            handleOpenMenu(e);
            setRow(params);
          }}
        >
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      ),
    },
  ];

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setValue('index', newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setValue('size', event.target.value);
    setValue('index', 1);
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/user/new')}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <TableDynamic
            columns={columns}
            rows={watch('rows')}
            totalRow={_.get(qgetListUser, 'data.data.total', 5)}
            loading={Boolean(_.get(qgetListUser, 'isLoading'))}
            rowsPerPage={watch('size')}
            skipCount={(watch('index') - 1) * watch('size') || 0}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            baseViewUserDialogRef.current?.open({
              refetch: () => qgetListUser.refetch(),
              userId: _.get(row, '_id', ''),
            });
            setOpen(null);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            mDeleteUser.mutate(_.get(row, '_id', ''));
            setOpen(null);
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <UserDialog />
    </>
  );
}
