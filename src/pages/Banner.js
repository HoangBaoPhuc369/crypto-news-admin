/* eslint-disable arrow-body-style */
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
import BannerApiService from '../services/api-services/banner.service';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import CategoryDialog, { baseViewCategoryDialogRef } from '../components/dialog/CategoryDialog';
import toastService from '../services/core/toast.service';
import SocialDialog, { baseViewSocialDialogRef } from '../components/dialog/SocialDialog';
import BannerDialog, { baseViewBannerDialogRef } from '../components/dialog/BannerDialog';

export default function Banner() {
  const [open, setOpen] = useState(null);
  const [row, setRow] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const hookForm = useForm({
    defaultValues: {
      rows: [],
      index: 1,
      size: 7,
    },
  });

  const { watch, setValue } = hookForm;

  const qgetListBanner = useQuery(
    ['qgetListBanner', watch('index'), watch('size'), watch('rows')],
    () =>
      BannerApiService.getListBanner({
        data: {
          index: watch('index'),
          size: watch('size'),
        },
        token: _.get(user, 'token'),
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setValue('rows', _.get(data, 'data.data', []));
      },
      onError: (err) => {},
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns = [
    {
      id: 'location',
      label: 'Location',
      headerCellSX: { bgcolor: '#EAEEF2' },
    },
    {
      id: 'bannerUrl',
      label: 'Image',
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => {
        let sizeImg = null;

        switch (_.get(params, 'location')) {
          case 'LARGE_HEADER_BANNER':
            sizeImg = {
              width: '400px',
              height: '60px',
            };
            break;

          case 'MEDIUM_HEADER_BANNER':
            sizeImg = {
              width: '300px',
              height: '60px',
            };
            break;
          default:
            sizeImg = {
              width: '150px',
              height: '80px',
            };
            break;
        }

        return (
          <img
            alt={_.get(params, 'location', '')}
            src={_.get(params, 'bannerUrl', '/assets/images/images/placeholder.png')}
            style={{
              width: `${_.get(sizeImg, 'width')}`,
              height: `${_.get(sizeImg, 'height')}`,
              borderRadius: '12px',
              objectFit: 'cover',
            }}
          />
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      width: 250,
      align: 'center',
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
        <title> Banner | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Banner
          </Typography>
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/social/new')}
          >
            New Banner
          </Button> */}
        </Stack>

        <Card>
          <TableDynamic
            columns={columns}
            rows={watch('rows') || []}
            totalRow={_.get(qgetListBanner, 'data.total', 7)}
            loading={Boolean(_.get(qgetListBanner, 'isLoading'))}
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
            baseViewBannerDialogRef.current?.open({
              refetch: () => qgetListBanner.refetch(),
              id: _.get(row, '_id', ''),
            });
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        {/* <MenuItem sx={{ color: 'error.main' }} onClick={() => mDeleteSocial.mutate(_.get(row, '_id', ''))}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
      </Popover>

      <BannerDialog />
    </>
  );
}
