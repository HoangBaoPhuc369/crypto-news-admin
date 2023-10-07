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
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import TextFiedCustom from '../components/form/TextFiedCustom';
import SelectField from '../components/form/SelectField';
import axios from 'axios';
import { useMutation } from 'react-query';
import _ from 'lodash';
import ImageApiService from '../services/api-services/images.service';
import Editor from '../components/editor';

export default function PostNew() {
  const editorEnRef = useRef(null);

  const hookForm = useForm({
    defaultValues: {
      body: [
        {
          local: 'en',
          title: '',
          subTitle: '',
          body: '',
        },
        {
          local: 'ja',
          title: '',
          subTitle: '',
          body: '',
        },
      ],
      tags: [],
      categoryId: '',
      imageUrl: '',
      hidden: false,
      status: 1, // 1 -> tạo; 99 -> xuất bản
    },
  });

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

        <Grid item xs={12} mb={2}>
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            Details:
          </Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6} mb={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
              English
            </Typography>
          </Grid>
          <Grid item xs={6} mb={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
              Japan
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
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
                  <Typography variant="subtitle2">Content</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
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
                    <Editor />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={() => hookForm.handleSubmit()()}>
          Create Post
        </Button>
      </Container>
    </>
  );
}
