/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Box, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import React, { createRef, useImperativeHandle, useState } from 'react';
import UserUpdate from '../userPage/UserUpdate';
import _ from 'lodash';
import SocialApiService from '../../services/api-services/social.service';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import CardLoading from '../form/CardLoading';
import CategoryUpdate from '../content/CategoryUpdate';
import SocialUpdate from '../content/SocialUpdate';

export const baseViewSocialDialogRef = createRef();

const SocialDialog = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(baseViewSocialDialogRef, () => ({
    open: (params) => {
      setData(params);
      mGetSocial.mutate(_.get(params, 'id', ''));
      handleClickOpen();
    },
    close: () => handleClose(),
  }));

  const mGetSocial = useMutation((data) => SocialApiService.getSocial({ data, token: _.get(user, 'token', '') }), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      // console.log(data);
    },
  });

  return (
    <Box>
      <Dialog
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen}
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Update Social</DialogTitle>
        <DialogContent>
          {Boolean(_.get(mGetSocial, 'isLoading')) ? (
            <CardLoading title="Loading . . ." />
          ) : (
            <SocialUpdate
              data={_.get(mGetSocial, 'data.data')}
              close={(reset) => {
                reset();
                handleClose();
              }}
              refetch={data?.refetch}
              paramId={data?.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SocialDialog;
