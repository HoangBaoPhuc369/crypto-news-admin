/* eslint-disable arrow-body-style */
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';

const CardLoading = ({ title }) => {
  return (
    <Box justifyContent="center" display="flex" flexDirection="column" alignItems="center">
      <CircularProgress color="primary" sx={{ mb: 2 }} />
      <Typography>{title}</Typography>
    </Box>
  );
};

export default CardLoading;
