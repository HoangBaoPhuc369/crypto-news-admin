/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Helmet } from 'react-helmet-async';
import _, { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  IconButton,
  Box,
  InputAdornment,
} from '@mui/material';
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
import toastService from '../services/core/toast.service';
import SelectField from '../components/form/SelectField';
import TextFiedCustom from '../components/form/TextFiedCustom';

export default function Category() {
  const [open, setOpen] = useState(null);
  const [row, setRow] = useState(null);

  const languageOpt = [
    {
      id: 'en',
      name: 'English',
    },
    {
      id: 'jp',
      name: 'Japan',
    },
  ];

  const { user } = useSelector((state) => state.auth);
  const hookForm = useForm({
    defaultValues: {
      rows: [],
      index: 1,
      size: 5,
      local: 'en',
    },
  });

  const { watch, setValue } = hookForm;

  const qgetListCategory = useQuery(
    ['qgetListCategory', watch('index'), watch('size'), watch('rows'), watch('local')],
    () =>
      CategoryApiService.getListCategory({
        data: {
          index: watch('index'),
          size: watch('size'),
          local: watch('local'),
        },
        token: _.get(user, 'token'),
      }),
    {
      onSuccess: (data) => {
        console.log(_.get(data, 'data.data', []));
        setValue('rows', _.get(data, 'data.data', []));
      },
      onError: (err) => {},
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const mDeleteCategory = useMutation(
    (data) => CategoryApiService.deleteCategory({ data, token: _.get(user, 'token', '') }),
    {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (data) => {
        handleCloseMenu();
        qgetListCategory.refetch();
        toastService.toast('success', 'Success', 'Delete Category Success!');
      },
    }
  );

  const columns = [
    {
      id: 'name',
      label: 'Name',
      width: 150,
      headerCellSX: { bgcolor: '#EAEEF2' },
    },
    {
      id: 'imageUrl',
      label: 'image',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => (
        <Box>
          <img
            src={_.get(
              params,
              'imageUrl',
              'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
            )}
            alt=""
            style={{ width: '150px', height: '50px', objectFit: 'cover', borderRadius: '12px' }}
          />
        </Box>
      ),
    },
    {
      id: 'isNavHeader',
      label: 'isNavHeader',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => {
        const label = Boolean(_.get(params, 'isNavHeader')) ? 'true' : 'false';
        return (
          <Label color={(!Boolean(_.get(params, 'isNavHeader')) && 'error') || 'success'}>{sentenceCase(label)}</Label>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      width: 100,
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

        <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2} mb={2}>
          <Box sx={{ width: '250px' }}>
            <SelectField name="local" label="Language" hookForm={hookForm} options={languageOpt} />
          </Box>
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

        <MenuItem sx={{ color: 'error.main' }} onClick={() => mDeleteCategory.mutate(_.get(row, '_id', ''))}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <CategoryDialog />
    </>
  );
}
