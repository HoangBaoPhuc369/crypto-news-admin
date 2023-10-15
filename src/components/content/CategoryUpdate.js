/* eslint-disable no-extra-boolean-cast */
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
import { LoadingButton } from '@mui/lab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import toastService from '../../services/core/toast.service';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageApiService from '../../services/api-services/images.service';
import { useState } from 'react';

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

export default function CategoryUpdate({ data, close, refetch, paramId }) {
  const { user } = useSelector((state) => state.auth);

  const yupValid = yup.object().shape({
    imageUrl: yup.string().required('Please choose a image'),
    name: yup.string().required('Name is a required field'),
  });

  const hookForm = useForm({
    defaultValues: {
      name: _.get(data, 'name', ''),
      imageUrl: _.get(data, 'imageUrl', ''),
      imgFile: null,
      isEditing: false,
    },
    resolver: yupResolver(yupValid),
  });
  const {
    formState: { errors },
  } = hookForm;

  const mUpdateCategory = useMutation((data) => CategoryApiService.updateCategory(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Update Category Failed!');
    },
    onSuccess: (data) => {
      toastService.toast('success', 'Success', 'Create Category Success!');
      refetch();
      close(hookForm.reset);
    },
  });

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
          hookForm.setValue('isEditing', true);
          hookForm.setValue('imageUrl', readerEvent.target.result, { shouldValidate: true });
        };
      }
    });
  };

  const [isConverting, setIsConverting] = useState(false);

  const mUploadImage = useMutation((data) => ImageApiService.uploadImage(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Upload Image Failed!');
    },
  });

  const handleUpdateCategory = async (data) => {
    if (Boolean(_.get(data, 'isEditing'))) {
      const formData = new FormData();
      formData.append('uploaded_file', hookForm.watch('imgFile'));
      const uploadedImage = await mUploadImage.mutateAsync({
        formData,
        token: _.get(user, 'token', ''),
        path: 'category',
      });

      const setImage = _.set(
        _.omit(data, ['imgFile', 'isEditing']),
        'imageUrl',
        _.get(
          uploadedImage,
          'data.url',
          'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
        )
      );

      mUpdateCategory.mutate({ data: setImage, token: _.get(user, 'token', ''), paramId });
    } else {
      mUpdateCategory.mutate({
        data: _.omit(data, ['imgFile', 'isEditing']),
        token: _.get(user, 'token', ''),
        paramId,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title> Category Update | Minimal UI </title>
      </Helmet>

      <Container>
        <Grid container spacing={3} sx={{ mb: '20px' }}>
          <Grid item xs={4}>
            <TextFiedCustom hookForm={hookForm} name="name" label={'Name'} />
          </Grid>
          <Grid item xs={12}>
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
              <img
                alt=""
                src={hookForm.watch('imageUrl')}
                style={{
                  width: '250px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginTop: '20px',
                }}
              />
            ) : null}
          </Grid>
        </Grid>
        <LoadingButton
          loading={Boolean(_.get(mUpdateCategory, 'isLoading')) || Boolean(_.get(mUploadImage, 'isLoading'))}
          variant="contained"
          color="primary"
          onClick={() => hookForm.handleSubmit(handleUpdateCategory)()}
        >
          Update Category
        </LoadingButton>
      </Container>
    </>
  );
}
