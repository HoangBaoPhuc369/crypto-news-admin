/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Box, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import React, { createRef, useImperativeHandle, useState } from 'react';
import UserUpdate from '../userPage/UserUpdate';
import _ from 'lodash';
import AuthApiService from '../../services/api-services/auth.service';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import CardLoading from '../form/CardLoading';

export const baseViewUserDialogRef = createRef();

const UserDialog = () => {
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

  useImperativeHandle(baseViewUserDialogRef, () => ({
    open: (params) => {
      setData(params);
      mGetUser.mutate(_.get(params, 'userId', ''));
      handleClickOpen();
    },
    close: () => handleClose(),
  }));

  const mGetUser = useMutation((data) => AuthApiService.getUser({ data, token: _.get(user, 'token', '') }), {
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
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          {Boolean(_.get(mGetUser, 'isLoading')) ? (
            <CardLoading title="Loading . . ." />
          ) : (
            <UserUpdate
              data={_.get(mGetUser, 'data.data')}
              close={() => handleClose()}
              refetch={data?.refetch}
              userId={data?.userId}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserDialog;
