/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Helmet } from 'react-helmet-async';
// @mui
import { Stack, Paper, Container, Typography, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import TextFiedCustom from '../components/form/TextFiedCustom';
import { useMutation } from 'react-query';
import SocialApiService from '../services/api-services/social.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import toastService from '../services/core/toast.service';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageApiService from '../services/api-services/images.service';

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

export default function SocialNew() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const yupValid = yup.object().shape({
    iconUrl: yup.string().required('Please choose a image'),
    name: yup.string().required('Name is a required field'),
  });

  const hookForm = useForm({
    defaultValues: {
      name: '',
      link: '',
      iconUrl: '',
      imgFile: null,
    },
    resolver: yupResolver(yupValid),
  });

  const {
    formState: { errors },
  } = hookForm;

  const mCreateSocial = useMutation((data) => SocialApiService.createSocial(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Create Social Failed!');
    },
    onSuccess: (data) => {
      toastService.toast('success', 'Success', 'Create Social Success!');
      hookForm.reset();
      navigate('/dashboard/social');
    },
  });

  const mUploadImage = useMutation((data) => ImageApiService.uploadImage(data), {
    onError: (err) => {
      toastService.toast('error', 'Error', 'Upload Image Failed!');
    },
  });

  const handleCreateSocial = async (data) => {
    const formData = new FormData();
    formData.append('uploaded_file', hookForm.watch('imgFile'));
    const uploadedImage = await mUploadImage.mutateAsync({
      formData,
      token: _.get(user, 'token', ''),
      path: 'social',
    });

    const setImage = _.set(
      _.omit(data, 'imgFile'),
      'iconUrl',
      _.get(
        uploadedImage,
        'data.url',
        'https://res.cloudinary.com/crypto-new-cloud/image/upload/v1697279024/post/0f8b3c4e0b70d524c8841134b6796c27.png.png'
      )
    );
    mCreateSocial.mutate({ data: setImage, token: _.get(user, 'token', '') });
  };

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
          hookForm.setValue('iconUrl', readerEvent.target.result, { shouldValidate: true });
        };
      }
    });
  };

  return (
    <>
      <Helmet>
        <title> Social New | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create a new social
          </Typography>
        </Stack>

        <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '20px', marginBottom: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextFiedCustom hookForm={hookForm} name="name" label={'Name'} />
            </Grid>
            <Grid item xs={6}>
              <TextFiedCustom hookForm={hookForm} name="link" label={'Link'} />
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
              {Boolean(_.get(errors, 'iconUrl.message')) ? (
                <Typography
                  variant="caption"
                  sx={{ color: '#FF4842', fontSize: '12px', fontWeight: '400', margin: '0 0 0 14px' }}
                >
                  {_.get(errors, 'iconUrl.message')}
                </Typography>
              ) : null}

              {Boolean(hookForm.watch('iconUrl')) ? (
                <img
                  alt=""
                  src={hookForm.watch('iconUrl')}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginTop: '20px',
                  }}
                  loading="lazy"
                />
              ) : null}
            </Grid>
          </Grid>
        </Paper>
        <LoadingButton
          loading={Boolean(_.get(mCreateSocial, 'isLoading')) || Boolean(_.get(mUploadImage, 'isLoading'))}
          variant="contained"
          color="primary"
          onClick={() => hookForm.handleSubmit(handleCreateSocial)()}
        >
          Create Social
        </LoadingButton>
      </Container>
    </>
  );
}
