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
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import TextFiedCustom from '../components/form/TextFiedCustom';
import SelectField from '../components/form/SelectField';
import axios from 'axios';
import { useMutation } from 'react-query';
import _ from 'lodash';
import ImageApiService from '../services/api-services/images.service';
import Editor from '../components/editor';
import DropImageFile from '../components/form/DropImageFile';

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

  useEffect(() => {
    console.log(hookForm.watch());
  }, [hookForm.watch()]);

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

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
              English
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Details</Typography>
                </Grid>
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
                  <Typography variant="subtitle2" mb={2}>
                    Content
                  </Typography>

                  <Box>
                    <Editor hanldeEditor={(data) => hookForm.setValue('body[0].body', data)} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
              Japan
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Details</Typography>
                </Grid>
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
                    <Editor hanldeEditor={(data) => hookForm.setValue('body[1].body', data)} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: '600', mb: '20px' }}>
                  Image
                </Typography>

                <DropImageFile />
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                  Properties
                </Typography>
              </Grid>
            </Grid>

            <Paper elevation={3} sx={{ display: 'flex', gap: '20px', padding: '24px', marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <SelectField hookForm={hookForm} label={'Category'} name="body[0].title" />
                </Grid>

                <Grid item xs={6}>
                  <SelectField hookForm={hookForm} label={'Tag'} name="body[0].title" />
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
