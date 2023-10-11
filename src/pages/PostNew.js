/* eslint-disable arrow-body-style */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-assign */
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
  Box,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextFiedCustom from '../components/form/TextFiedCustom';
import SelectField from '../components/form/SelectField';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import _ from 'lodash';
import ImageApiService from '../services/api-services/images.service';
import Editor from '../components/editor';
import DropImageFile from '../components/form/DropImageFile';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LoadingButton } from '@mui/lab';
import CategoryApiService from '../services/api-services/category.service';
import { useSelector } from 'react-redux';
import PostApiService from '../services/api-services/post.service';
import { useNavigate } from 'react-router-dom';
import dataURItoBlob from '../helpers/dataURItoBlob';
// import { img_empty_data } from 'assets/images/img_empty_data.svg';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function PostNew() {
  const { user } = useSelector((state) => state.auth);

  const qgetListCategory = useQuery(
    ['qgetListCategory'],
    () => CategoryApiService.getAllListCategory(_.get(user, 'token')),
    {
      onSuccess: (data) => {},
      onError: (err) => {},
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const hookForm = useForm({
    defaultValues: {
      body: [
        {
          local: 'en',
          title: '',
          subTitle: '',
          body: '',
        },
        {
          local: 'ja',
          title: '',
          subTitle: '',
          body: '',
        },
      ],
      tags: ['Crypto', 'BlockChain', 'News'],
      categoryId: '',
      imageUrl: '',
      hidden: false,
      status: 99, // 1 -> tạo; 99 -> xuất bản
    },
  });

  // useEffect(() => {
  //   console.log(hookForm.watch());
  // }, [hookForm.watch()]);

  const [isConverting, setIsConverting] = useState(false);
  const [file, setFile] = useState(false);

  const handleImages = (e) => {
    setIsConverting(true);
    let files = Array.from(e.target.files);
    files.forEach((img) => {
      if (
        img.type !== 'image/jpeg' &&
        img.type !== 'image/png' &&
        img.type !== 'image/webp' &&
        img.type !== 'image/gif'
      ) {
        // dispatch(setError(
        //   `${img.name} format is unsupported ! only Jpeg, Png, Webp, Gif are allowed.`
        // ));
        files = files.filter((item) => item.name !== img.name);
      } else if (img.size > 1024 * 1024) {
        // dispatch(setError(`${img.name} size is too large max 5mb allowed.`));
        files = files.filter((item) => item.name !== img.name);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (readerEvent) => {
          setIsConverting(false);
          setFile(_.get(e, 'target.files[0]', null));
          hookForm.setValue('imageUrl', readerEvent.target.result);
        };
      }
    });
  };

  const navigate = useNavigate();
  const mCreatePost = useMutation((data) => PostApiService.createPost(data), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      navigate('/dashboard/post');
    },
  });

  const mUploadImage = useMutation((data) => PostApiService.uploadImage(data), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      const finalObj = _.set(_.omit(hookForm.watch(), ['categoryIdHideObj', 'tagsHideObj']), 'imageUrl', _.get(data, 'data.url', ''));

      mCreatePost.mutate({
        data: finalObj,
        token: _.get(user, 'token', ''),
      });
    },
  });

  const handleCreatePost = (data)  => {

    // const convertImg = dataURItoBlob(_.get(data, 'imageUrl', ''));

    // const path = `/post/images`;
    // console.log(file);
    const formData = new FormData();
    formData.append("uploaded_file", file);
      
    // formData.append("uploaded_file", convertImg);
    // console.log(formData);
    mUploadImage.mutate({formData, token: _.get(user, 'token', '')})
  };

  return (
    <>
      <Helmet>
        <title> Post New | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create a new post
          </Typography>
        </Stack>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
              English
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Details</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextFiedCustom hookForm={hookForm} label={'Post title'} name="body[0].title" />
                </Grid>

                <Grid item xs={12}>
                  <TextFiedCustom
                    hookForm={hookForm}
                    label={'Post subtitle'}
                    name="body[0].subTitle"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={2}>
                    Content
                  </Typography>

                  <Box>
                    <Editor hanldeEditor={(data) => hookForm.setValue('body[0].body', data)} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
              Japan
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Details</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextFiedCustom hookForm={hookForm} label={'Post title'} name="body[1].title" />
                </Grid>

                <Grid item xs={12}>
                  <TextFiedCustom
                    hookForm={hookForm}
                    label={'Post subtitle'}
                    name="body[1].subTitle"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={2}>
                    Content
                  </Typography>

                  <Box>
                    <Editor hanldeEditor={(data) => hookForm.setValue('body[1].body', data)} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: '600', mb: '20px' }}>
                  Image
                </Typography>

                {/* <DropImageFile /> */}
                <LoadingButton
                  loading={isConverting}
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImages} />
                </LoadingButton>

                {Boolean(hookForm.watch('imageUrl')) ? (
                  <Paper
                    elevation={3}
                    sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px', marginTop: '20px' }}
                  >
                    <img
                      alt=""
                      src={hookForm.watch('imageUrl')}
                      style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  </Paper>
                ) : null}
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                  Properties
                </Typography>
              </Grid>
            </Grid>

            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <SelectField
                    hookForm={hookForm}
                    label={'Category'}
                    name="categoryId"
                    options={_.map(_.get(qgetListCategory, 'data.data', []), (item) => {
                      return {
                        id: _.get(item, '_id', ''),
                        name: _.get(item, 'name', ''),
                      };
                    })}
                  />
                </Grid>

                {/* <Grid item xs={6}>
                  <SelectField hookForm={hookForm} label={'Tag'} name="tags" />
                </Grid> */}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <LoadingButton loading={Boolean(_.get(mCreatePost, 'isLoading')) || Boolean(_.get(mUploadImage, 'isLoading'))} variant="contained" color="primary" onClick={() => hookForm.handleSubmit(handleCreatePost)()}>
          Create Post
        </LoadingButton>
      </Container>
    </>
  );
}
