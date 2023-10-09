/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Box, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import React, { createRef, useImperativeHandle, useState } from 'react';
import UserUpdate from '../userPage/UserUpdate';
import _ from 'lodash';
import CategoryApiService from '../../services/api-services/category.service';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import CardLoading from '../form/CardLoading';
import CategoryUpdate from '../content/CategoryUpdate';

export const baseViewCategoryDialogRef = createRef();

const CategoryDialog = () => {
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

  useImperativeHandle(baseViewCategoryDialogRef, () => ({
    open: (params) => {
      console.log(params);
      setData(params);
      mGetCategory.mutate(_.get(params, 'id', ''));
      handleClickOpen();
    },
    close: () => handleClose(),
  }));

  const mGetCategory = useMutation(
    (data) => CategoryApiService.getCategory({ data, token: _.get(user, 'token', '') }),
    {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

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
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          {Boolean(_.get(mGetCategory, 'isLoading')) ? (
            <CardLoading title="Loading . . ." />
          ) : (
            <CategoryUpdate
              data={_.get(mGetCategory, 'data.data')}
              close={() => handleClose()}
              refetch={data?.refetch}
              paramId={data?.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CategoryDialog;
