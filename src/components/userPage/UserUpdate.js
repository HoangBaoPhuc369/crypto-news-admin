/* eslint-disable no-extra-boolean-cast */
/* eslint-disable arrow-body-style */
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
import AuthApiService from '../../services/api-services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { LoadingButton } from '@mui/lab';
import ImageApiService from '../../services/api-services/images.service';
import * as yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import toastService from '../../services/core/toast.service';
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

export default function UserUpdate({ data, close, refetch, userId }) {
  const { user } = useSelector((state) => state.auth);
  const yupValid = yup.object().shape({
    email: yup.string().email('Please type an email format!').required('Email is a required field'),
    password: yup.string(),
    name: yup.string().required('Name is a required field'),
    roles: yup.string().required('Role is a required field'),
    avatar: yup.string().required('Please choose an image'),
  });
  const hookForm = useForm({
    defaultValues: {
      email: _.get(data, 'email', ''),
      password: _.get(data, 'password', ''),
      name: _.get(data, 'name', ''),
      roles: _.get(data, 'roles[0]', ''),
      avatar: _.get(data, 'avatar', ''),
      active: _.get(data, 'active', false),
      imgFile: null,
      isEditing: false,
    },
    resolver: yupResolver(yupValid),
  });

  const {
    formState: { errors },
  } = hookForm;

  const mUploadImage = useMutation((data) => ImageApiService.uploadImage(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Upload Image Failed!');
    },
  });

  const handleUpdateUser = async (data) => {
    if (Boolean(_.get(data, 'isEditing'))) {
      const formData = new FormData();
      formData.append('uploaded_file', hookForm.watch('imgFile'));
      const uploadedImage = await mUploadImage.mutateAsync({
        formData,
        token: _.get(user, 'token', ''),
        path: 'user',
      });

      const setImage = _.set(
        _.omit(data, ['imgFile', 'activeHideObj', 'rolesHideObj', 'isEditing']),
        'avatar',
        _.get(
          uploadedImage,
          'data.url',
          'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
        )
      );

      let finalObj;

      if (Boolean(_.get(setImage, 'password'))) {
        finalObj = setImage;
      } else {
        finalObj = _.omit(setImage, 'password');
      }

      mUpdateUser.mutate({ data: finalObj, token: _.get(user, 'token', ''), userId });
    } else {
      let finalObj;
      if (Boolean(_.get(data, 'password'))) {
        finalObj = data;
      } else {
        finalObj = _.omit(data, 'password');
      }

      mUpdateUser.mutate({
        data: _.omit(finalObj, ['imgFile', 'isEditing', 'activeHideObj', 'rolesHideObj']),
        token: _.get(user, 'token', ''),
        userId,
      });
    }
  };

  const mUpdateUser = useMutation((data) => AuthApiService.updateUser(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Update User Failed!');
    },
    onSuccess: (data) => {
      refetch();
      close();
      toastService.toast('success', 'Success', 'Update User Success!');
    },
  });

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
          hookForm.setValue('isEditing', true);
          hookForm.setValue('avatar', readerEvent.target.result, { shouldValidate: true });
        };
      }
    });
  };

  return (
    <>
      <Helmet>
        <title> User Update | Minimal UI </title>
      </Helmet>

      <Container sx={{ marginTop: '15px' }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextFiedCustom hookForm={hookForm} name="name" label={'Name'} />
          </Grid>
          <Grid item xs={6}>
            <TextFiedCustom hookForm={hookForm} name="password" label={'Password'} />
          </Grid>
          <Grid item xs={6}>
            <TextFiedCustom hookForm={hookForm} name="email" label={'Email'} />
          </Grid>
          <Grid item xs={6}>
            <SelectField
              hookForm={hookForm}
              name="roles"
              label={'Role'}
              options={[
                {
                  id: 'admin',
                  name: 'Admin',
                },
                {
                  id: 'writer',
                  name: 'Writer',
                },
              ]}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectField
              hookForm={hookForm}
              name="active"
              label="Status"
              options={[
                {
                  id: true,
                  name: 'active',
                },
                {
                  id: false,
                  name: 'banned',
                },
              ]}
            />
          </Grid>

          <Grid item xs={6}>
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
            {Boolean(_.get(errors, 'avatar.message')) ? (
              <Typography
                variant="caption"
                sx={{ color: '#FF4842', fontSize: '12px', fontWeight: '400', margin: '0 0 0 14px' }}
              >
                {_.get(errors, 'avatar.message')}
              </Typography>
            ) : null}

            {Boolean(hookForm.watch('avatar')) ? (
              <img
                alt=""
                src={hookForm.watch('avatar')}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginTop: '20px',
                }}
                loading="lazy"
              />
            ) : null}
          </Grid>
        </Grid>
        <LoadingButton
          loading={Boolean(_.get(mUpdateUser, 'isLoading')) || Boolean(_.get(mUploadImage, 'isLoading'))}
          variant="contained"
          color="primary"
          onClick={() => hookForm.handleSubmit(handleUpdateUser)()}
        >
          Update User
        </LoadingButton>
      </Container>
    </>
  );
}
