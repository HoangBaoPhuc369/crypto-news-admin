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
import { LoadingButton } from '@mui/lab';
import CategoryApiService from '../services/api-services/category.service';
import { useSelector } from 'react-redux';
import PostApiService from '../services/api-services/post.service';
import { useNavigate } from 'react-router-dom';
import dataURItoBlob from '../helpers/dataURItoBlob';
// import { img_empty_data } from 'assets/images/img_empty_data.svg';
import SelectFieldMultiple from '../components/form/SelectFieldMultiple';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SwitchField from '../components/form/SwitchField';
import toastService from '../services/core/toast.service';

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
      onSuccess: (data) => {
        // console.log(data);
      },
      refetchOnWindowFocus: false,
    }
  );

  const qgetListTags = useQuery(['qgetListTags'], () => CategoryApiService.getAllListTags(_.get(user, 'token')), {
    refetchOnWindowFocus: false,
  });

  const yupValid = yup.object().shape({
    body: yup.array().of(
      yup.object().shape({
        title: yup.string().required('Post title is a required field').typeError('Post title is a required field'),
        subTitle: yup
          .string()
          .required('Post subtitle is a required field')
          .typeError('Post subtitle is a required field'),
        body: yup.string().required('Content is a required field').typeError('Content is a required field'),
      })
    ),
    imageUrl: yup.string().required('Please choose a image'),
    tags: yup.array().min(1, 'Please type at least one tag').typeError('Tags is a required field'),
    categoryId: yup.string().required('Category is a required field').typeError('Category is a required field'),
  });

  const defaultValues = {
    body: [
      {
        local: 'en',
        title: '',
        subTitle: '',
        body: '',
      },
      {
        local: 'jp',
        title: '',
        subTitle: '',
        body: '',
      },
    ],
    tags: [],
    categoryId: '',
    imageUrl: '',
    imgFile: null,
    hidden: false,
    status: false,
    isSpotlight: false,
  };

  const hookForm = useForm({
    defaultValues,
    resolver: yupResolver(yupValid),
  });

  // useEffect(() => {
  //   console.log(hookForm.watch());
  // }, [hookForm.watch()]);

  const [isConverting, setIsConverting] = useState(false);

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
        toastService.toast(
          'error',
          'Warning',
          `${img.name} format is unsupported ! only Jpeg, Png, Webp, Gif are allowed.`
        );
        files = files.filter((item) => item.name !== img.name);
      } else if (img.size > 1024 * 1024) {
        toastService.toast('error', 'Warning', `${img.name} size is too large max 5mb allowed.`);
        files = files.filter((item) => item.name !== img.name);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (readerEvent) => {
          setIsConverting(false);
          hookForm.setValue('imgFile', _.get(e, 'target.files[0]', null));
          hookForm.setValue('imageUrl', readerEvent.target.result, { shouldValidate: true });
        };
      }
    });
  };

  const navigate = useNavigate();

  const mCreatePost = useMutation((data) => PostApiService.createPost(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Create Post Failed!');
    },
    onSuccess: (data) => {
      toastService.toast('success', 'Success', 'Create Post Success!');
      hookForm.reset();
      navigate('/dashboard/post');
    },
  });

  const mUploadImage = useMutation((data) => ImageApiService.uploadImage(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Upload Image Failed!');
    },
  });

  const handleCreatePost = async (data) => {
    const formData = new FormData();
    formData.append('uploaded_file', hookForm.watch('imgFile'));
    const uploadedImage = await mUploadImage.mutateAsync({ formData, token: _.get(user, 'token', ''), path: 'post' });
    const setImage = _.set(
      _.omit(data, ['categoryIdHideObj', 'imgFile']),
      'imageUrl',
      _.get(
        uploadedImage,
        'data.url',
        'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
      )
    );

    const finalObj = _.set(setImage, 'status', Boolean(_.get(data, 'status')) ? 99 : 1);

    mCreatePost.mutate({ data: finalObj, token: _.get(user, 'token', '') });
  };

  const {
    formState: { errors },
  } = hookForm;

  const handleBack = () => {
    hookForm.reset();
    navigate('/dashboard/post');
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
                    <Editor
                      hanldeEditor={(data) => hookForm.setValue('body[0].body', data, { shouldValidate: true })}
                    />
                    {Boolean(_.get(errors, 'body[0].body.message')) ? (
                      <Typography
                        variant="caption"
                        sx={{ color: '#FF4842', fontSize: '12px', fontWeight: '400', margin: '0 0 0 14px' }}
                      >
                        {_.get(errors, 'body[0].body.message')}
                      </Typography>
                    ) : null}
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
                    <Editor
                      hanldeEditor={(data) => hookForm.setValue('body[1].body', data, { shouldValidate: true })}
                    />
                    {Boolean(_.get(errors, 'body[1].body.message')) ? (
                      <Typography
                        variant="caption"
                        sx={{ color: '#FF4842', fontSize: '12px', fontWeight: '400', margin: '0 0 0 14px' }}
                      >
                        {_.get(errors, 'body[1].body.message')}
                      </Typography>
                    ) : null}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: '600', mb: '20px' }}>
                  Image
                </Typography>

                {/* <DropImageFile /> */}
                <Grid item>
                  <LoadingButton
                    loading={isConverting}
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImages} />
                  </LoadingButton>
                </Grid>
                {Boolean(_.get(errors, 'imageUrl.message')) ? (
                  <Typography
                    variant="caption"
                    sx={{ color: '#FF4842', fontSize: '12px', fontWeight: '400', margin: '0 0 0 14px' }}
                  >
                    {_.get(errors, 'imageUrl.message')}
                  </Typography>
                ) : null}

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
                    label="Category"
                    name="categoryId"
                    options={_.map(_.get(qgetListCategory, 'data.data.data', []), (item) => {
                      return {
                        id: _.get(item, '_id', ''),
                        name: _.get(item, 'name', ''),
                      };
                    })}
                  />
                </Grid>

                <Grid item xs={6}>
                  <SelectFieldMultiple
                    hookForm={hookForm}
                    label="Tags"
                    name="tags"
                    placeholder="Tags"
                    options={_.get(qgetListTags, 'data.data', [])}
                  />
                </Grid>

                <Grid item xs={6}>
                  <SwitchField hookForm={hookForm} label="Publish" name="status" />
                  <SwitchField hookForm={hookForm} label="Spotlight" name="isSpotlight" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', gap: '15px' }}>
          <LoadingButton
            loading={Boolean(_.get(mCreatePost, 'isLoading')) || Boolean(_.get(mUploadImage, 'isLoading'))}
            variant="contained"
            color="primary"
            onClick={() => hookForm.handleSubmit(handleCreatePost)()}
          >
            Create Post
          </LoadingButton>

          <Button variant="default" sx={{ backgroundColor: 'grey.300' }} onClick={() => handleBack()}>
            Back
          </Button>
        </Box>
      </Container>
    </>
  );
}
