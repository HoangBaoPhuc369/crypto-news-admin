/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Box, Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import React, { createRef, useImperativeHandle, useState } from 'react';
import UserUpdate from '../userPage/UserUpdate';
import _ from 'lodash';
import PostApiService from '../../services/api-services/post.service';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import CardLoading from '../form/CardLoading';
import CategoryUpdate from '../content/CategoryUpdate';
import PostDetail from '../content/PostDetail';
import CloseIcon from '@mui/icons-material/Close';

export const baseViewPostDetailDialogRef = createRef();

const PostDetailDialog = () => {
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

  useImperativeHandle(baseViewPostDetailDialogRef, () => ({
    open: (params) => {
      setData(params);
      mGetPost.mutate(params);
      handleClickOpen();
    },
    close: () => handleClose(),
  }));

  const mGetPost = useMutation((data) => PostApiService.getPost({ data, token: _.get(user, 'token', '') }), {
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
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>Post Detail</DialogTitle>
        <DialogContent>
          {Boolean(_.get(mGetPost, 'isLoading')) ? (
            <CardLoading title="Loading . . ." />
          ) : (
            <PostDetail data={_.get(mGetPost, 'data.data')} close={() => handleClose()} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PostDetailDialog;
