/* eslint-disable arrow-body-style */
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import _ from 'lodash';
import moment from 'moment/moment';
import 'quill/dist/quill.snow.css';
import parse from 'html-react-parser';

const PostDetail = ({ data, close }) => {
  console.log(data);
  return (
    <>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} sx={{}}>
          <Grid
            item
            xs={12}
            sx={{
              width: '100%',
              borderRadius: '24px',
              background: '#F5F5F5',
              // height: '504px',
              // position: 'relative',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
            }}
          >
            <Typography
              sx={{ display: 'flex', justifyContent: 'center', padding: '32px', fontSize: '22px', fontWeight: '600' }}
            >
              {_.get(data, 'title', '')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={_.get(data, 'imageUrl', '/assets/images/images/placeholder.png')}
                style={{
                  width: 'calc(100% - 32px)',
                  height: '450px',
                  borderRadius: '16px',
                  marginBottom: '16px',
                  objectFit: 'cover',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
                }}
                alt=""
              />
            </Box>
          </Grid>

          <Grid item xs={12} mt={3} sx={{ display: 'flex', gap: '26px', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <CalendarMonthIcon sx={{ color: '#3E323280', fontSize: '20px' }} />
              <Typography sx={{ color: '#3E323280', fontSize: '14px' }}>
                {moment(_.get(data, 'createdAt', new Date())).format('MMMM DD, YYYY')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <PersonIcon sx={{ color: '#3E323280', fontSize: '20px' }} />
              <Typography sx={{ color: '#3E323280', fontSize: '14px' }}>By {_.get(data, 'author.name', '')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <CategoryIcon sx={{ color: '#3E323280', fontSize: '20px' }} />
              <Typography sx={{ color: '#3E323280', fontSize: '14px' }}>{_.get(data, 'categoryName', '')}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ margin: '25px 16px 40px 16px' }}>
            <div className="ql-editor ql-css-img">{parse(_.get(data, 'body', ''))}</div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PostDetail;
