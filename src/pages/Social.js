/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Helmet } from 'react-helmet-async';
import _, { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import { Card, Stack, Button, Popover, MenuItem, Container, Typography, IconButton, Avatar } from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
// sections
// mock
import { useNavigate } from 'react-router-dom';
import TableDynamic from '../components/form/TableDynamic';
import { useMutation, useQuery } from 'react-query';
import SocialApiService from '../services/api-services/social.service';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import CategoryDialog, { baseViewCategoryDialogRef } from '../components/dialog/CategoryDialog';
import toastService from '../services/core/toast.service';

export default function Social() {
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

  const qgetListSocial = useQuery(
    ['qgetListSocial', watch('index'), watch('size'), watch('rows')],
    () =>
      SocialApiService.getListSocial({
        data: {
          index: watch('index'),
          size: watch('size'),
        },
        token: _.get(user, 'token'),
      }),
    {
      onSuccess: (data) => {
        // console.log(data);
        setValue('rows', _.get(data, 'data', []));
      },
      onError: (err) => {},
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns = [
    {
      id: 'name',
      label: 'Name',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
    },
    {
      id: 'iconUrl',
      label: 'icon',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => (
        <Avatar
          alt={_.get(params, 'name', '')}
          src={_.get(params, 'iconUrl', '/assets/images/images/placeholder.png')}
        />
      ),
    },
    {
      id: 'link',
      label: 'Link',
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

  const mDeleteSocial = useMutation((data) => SocialApiService.deleteSocial({ data, token: _.get(user, 'token', '') }), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      handleCloseMenu();
      qgetListSocial.refetch();
      toastService.toast('success', 'Success', 'Delete Social Success!');
    },
  });

  return (
    <>
      <Helmet>
        <title> Social | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Social
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/social/new')}
          >
            New Social
          </Button>
        </Stack>

        <Card>
          <TableDynamic
            columns={columns}
            rows={watch('rows') || []}
            totalRow={_.get(qgetListSocial, 'data.data.total', 5)}
            loading={Boolean(_.get(qgetListSocial, 'isLoading'))}
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
              refetch: () => qgetListSocial.refetch(),
              id: _.get(row, '_id', ''),
            });
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => mDeleteSocial.mutate(_.get(row, '_id', ''))}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <CategoryDialog />
    </>
  );
}
