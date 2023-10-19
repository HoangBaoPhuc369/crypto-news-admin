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
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import TextFiedCustom from '../form/TextFiedCustom';
import SelectField from '../form/SelectField';
import { useMutation } from 'react-query';
import BannerApiService from '../../services/api-services/banner.service';
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

export default function BannerUpdate({ data, close, refetch, paramId }) {
  const { user } = useSelector((state) => state.auth);

  const hookForm = useForm({
    defaultValues: {
      location: _.get(data, 'location', ''),
      bannerUrl: _.get(data, 'bannerUrl', ''),
      imgFile: null,
      isEditing: false,
    },
  });
  const {
    formState: { errors },
  } = hookForm;

  const mUpdateBanner = useMutation((data) => BannerApiService.updateBanner(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Update Banner Failed!');
    },
    onSuccess: (data) => {
      toastService.toast('success', 'Success', 'Update Banner Success!');
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
          hookForm.setValue('bannerUrl', readerEvent.target.result, { shouldValidate: true });
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

  const handleUpdateSocial = async (data) => {
    if (Boolean(_.get(data, 'isEditing'))) {
      const formData = new FormData();
      formData.append('uploaded_file', hookForm.watch('imgFile'));
      const uploadedImage = await mUploadImage.mutateAsync({
        formData,
        token: _.get(user, 'token', ''),
        path: 'banner',
      });

      const setImage = _.set(
        _.omit(data, ['imgFile', 'isEditing']),
        'bannerUrl',
        _.get(
          uploadedImage,
          'data.url',
          'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
        )
      );

      mUpdateBanner.mutate({ data: setImage, token: _.get(user, 'token', ''), paramId });
    } else {
      mUpdateBanner.mutate({
        data: _.omit(data, ['imgFile', 'isEditing']),
        token: _.get(user, 'token', ''),
        paramId,
      });
    }
  };

  let sizeImg = null;

  switch (hookForm.watch('location')) {
    case 'LARGE_HEADER_BANNER':
      sizeImg = {
        width: '800px',
        height: '150px',
      };
      break;

    case 'MEDIUM_HEADER_BANNER':
      sizeImg = {
        width: '650px',
        height: '150px',
      };
      break;

    case 'MEDIUM_DETAIL_BANNER_1':
      sizeImg = {
        width: '350px',
        height: '200px',
      };
      break;

    case 'MEDIUM_DETAIL_BANNER_2':
      sizeImg = {
        width: '350px',
        height: '200px',
      };
      break;
    case 'MEDIUM_DETAIL_BANNER_3':
      sizeImg = {
        width: '350px',
        height: '200px',
      };
      break;

    default:
      sizeImg = {
        width: '200px',
        heigth: '100px',
      };
      break;
  }

  return (
    <>
      <Helmet>
        <title> Banner Update | Minimal UI </title>
      </Helmet>

      <Container>
        <Box direction="row" alignItems="center" justifyContent="space-between" mb={5} />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextFiedCustom hookForm={hookForm} name="location" label={'Location'} />
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
            {Boolean(_.get(errors, 'bannerUrl.message')) ? (
              <Typography
                variant="caption"
                sx={{ color: '#FF4842', fontSize: '12px', fontWeight: '400', margin: '0 0 0 14px' }}
              >
                {_.get(errors, 'bannerUrl.message')}
              </Typography>
            ) : null}

            {Boolean(hookForm.watch('bannerUrl')) ? (
              <img
                alt=""
                src={hookForm.watch('bannerUrl')}
                style={{
                  width: `${_.get(sizeImg, 'width')}`,
                  height: `${_.get(sizeImg, 'height')}`,
                  objectFit: 'cover',
                  borderRadius: '12px',
                  margin: '20px 0',
                }}
                loading="lazy"
              />
            ) : null}
          </Grid>
        </Grid>
        <LoadingButton
          loading={Boolean(_.get(mUpdateBanner, 'isLoading')) || Boolean(_.get(mUploadImage, 'isLoading'))}
          variant="contained"
          color="primary"
          onClick={() => hookForm.handleSubmit(handleUpdateSocial)()}
        >
          Update Social
        </LoadingButton>
      </Container>
    </>
  );
}
