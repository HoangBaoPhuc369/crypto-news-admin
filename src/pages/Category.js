/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Helmet } from 'react-helmet-async';
import _, { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import { Card, Stack, Button, Popover, MenuItem, Container, Typography, IconButton } from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
// sections
// mock
import { useNavigate } from 'react-router-dom';
import TableDynamic from '../components/form/TableDynamic';
import { useMutation, useQuery } from 'react-query';
import CategoryApiService from '../services/api-services/category.service';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import CategoryDialog, { baseViewCategoryDialogRef } from '../components/dialog/CategoryDialog';

export default function Category() {
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

  const qgetListCategory = useQuery(
    ['qgetListCategory', watch('index'), watch('size'), watch('rows')],
    () =>
      CategoryApiService.getListCategory({
        data: {
          index: watch('index'),
          size: watch('size'),
        },
        token: _.get(user, 'token'),
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setValue('rows', _.get(data, 'data', []));
      },
      onError: (err) => {},
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const mDeleteUser = useMutation((data) => CategoryApiService.deleteUser({ data, token: _.get(user, 'token', '') }), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      handleCloseMenu();
      qgetListCategory.refetch();
    },
  });

  const columns = [
    {
      id: 'name',
      label: 'Name',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
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
            Category
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/category/new')}
          >
            New Category
          </Button>
        </Stack>

        <Card>
          <TableDynamic
            columns={columns}
            rows={watch('rows') || []}
            totalRow={_.get(qgetListCategory, 'data.data.total', 5)}
            loading={Boolean(_.get(qgetListCategory, 'isLoading'))}
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
            handleCloseMenu();
            baseViewCategoryDialogRef.current?.open({
              refetch: () => qgetListCategory.refetch(),
              id: _.get(row, '_id', ''),
            });
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => mDeleteUser.mutate(_.get(row, '_id', ''))}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <CategoryDialog />
    </>
  );
}
