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
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  IconButton,
  Avatar,
  Grid,
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
import PostApiService from '../services/api-services/post.service';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import CategoryDialog, { baseViewCategoryDialogRef } from '../components/dialog/CategoryDialog';
import TextFiedCustom from '../components/form/TextFiedCustom';
import SelectField from '../components/form/SelectField';
import { ReactComponent as SearchIconV2 } from '../svg/SearchIconV2.svg';
import PostEdit from './PostEdit';
import toastService from '../services/core/toast.service';
import PostDetailDialog, { baseViewPostDetailDialogRef } from '../components/dialog/PostDetailDialog';

export default function Post() {
  const [open, setOpen] = useState(null);
  const [row, setRow] = useState(null);
  const [stext, setStext] = useState('');
  const { user } = useSelector((state) => state.auth);

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

  const hookForm = useForm({
    defaultValues: {
      rows: [],
      index: 1,
      size: 5,
      searchText: '',
      language: '',
    },
  });

  const { watch, setValue } = hookForm;

  const qgetListPost = useQuery(
    ['qgetListPost', watch('index'), watch('size'), watch('rows'), watch('language'), stext],
    () =>
      PostApiService.getListPost({
        data: {
          index: watch('index'),
          size: watch('size'),
          searchText: stext,
          language: watch('language'),
        },
        token: _.get(user, 'token'),
      }),
    {
      onSuccess: (data) => {
        setValue('rows', _.get(data, 'data.data', []));
      },
      onError: (err) => {},
      keepPreviousData: true,
      // refetchOnWindowFocus: false,
    }
  );

  const mDeletePost = useMutation((data) => PostApiService.deletePost({ data, token: _.get(user, 'token', '') }), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      // console.log(data);
      toastService.toast('success', 'Success', 'Delete Post Success!');
      handleCloseMenu();
      qgetListPost.refetch();
    },
  });

  const mPublishPost = useMutation(
    (data) => PostApiService.publishPost({ paramId: data, token: _.get(user, 'token', '') }),
    {
      onError: (err) => {
        toastService.toast('error', 'Error', 'Publish Post Failed!');
      },
      onSuccess: (data) => {
        // console.log(data);
        toastService.toast('success', 'Success', 'Publish Post Success!');
        handleCloseMenu();
        qgetListPost.refetch();
      },
    }
  );

  const columns = [
    {
      id: 'imageUrl',
      label: 'Image',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => (
        <img
          src={_.get(params, 'imageUrl', '/assets/images/images/placeholder.png')}
          alt=""
          loading="lazy"
          style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '12px' }}
        />
      ),
    },
    {
      id: 'title',
      label: 'Title',
      width: 150,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => (
        <Typography
          sx={{
            width: '250px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
          variant="subtitle1"
          component="div"
        >
          {_.get(params, 'title', '')}
        </Typography>
      ),
    },
    {
      id: 'author',
      label: 'icon',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar
            alt={_.get(params, 'author.name', '')}
            src={_.get(params, 'author.avatar', '/assets/images/images/placeholder.png')}
          />
          <Box>
            <Typography variant="subtitle2">{_.get(params, 'author.name', '')}</Typography>
            <Typography variant="caption">{_.get(params, 'author.email', '')}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'views',
      label: 'Views',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
    },
    {
      id: 'status',
      label: 'Status',
      width: 200,
      headerCellSX: { bgcolor: '#EAEEF2' },
      renderCell: (params) => {
        const label = _.get(params, 'status') === 1 ? 'unpublish' : 'publish';
        return <Label color={(_.get(params, 'status') === 1 && 'error') || 'success'}>{sentenceCase(label)}</Label>;
      },
    },
    {
      id: 'local',
      label: 'Language',
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
        <title> Post | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Post
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/post/new')}
          >
            New Post
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2} mb={2}>
          <Box sx={{ width: '250px' }}>
            <SelectField name="language" label="Language" hookForm={hookForm} options={languageOpt} />
          </Box>
          <Box sx={{ width: '500px' }}>
            <TextFiedCustom
              name="searchText"
              label="Search ..."
              hookForm={hookForm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify
                      icon={'eva:search-outline'}
                      width={28}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setStext(watch('searchText'))}
                    />
                    {/* <SearchIconV2 style={{ width: '28px', height: '28px', cursor: 'pointer' }} /> */}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        <Card>
          <TableDynamic
            columns={columns}
            rows={watch('rows') || []}
            totalRow={_.get(qgetListPost, 'data.data.total', 5)}
            loading={Boolean(_.get(qgetListPost, 'isLoading'))}
            rowsPerPage={watch('size')}
            skipCount={(watch('index') - 1) * watch('size') || 0}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            sxTable={{ width: '100%', whiteSpace: 'nowrap' }}
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
          sx={{ color: 'info.main' }}
          onClick={() => {
            baseViewPostDetailDialogRef?.current.open({
              id: _.get(row, '_id', ''),
              local: _.get(row, 'local', ''),
            });
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:eye-outline'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        {_.get(row, 'status') === 1 ? (
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => {
              mPublishPost.mutate(_.get(row, '_id', ''));
              handleCloseMenu();
            }}
          >
            <Iconify icon={'eva:globe-outline'} sx={{ mr: 2 }} />
            Publish
          </MenuItem>
        ) : null}

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            navigate(`/dashboard/post/edit/${_.get(row, '_id', '')}/local/${_.get(row, 'local', '')}`);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            mDeletePost.mutate(_.get(row, '_id', ''));
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <CategoryDialog />

      <PostDetailDialog />
    </>
  );
}
