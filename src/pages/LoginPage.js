/* eslint-disable import/order */
/* eslint-disable react/self-closing-comp */
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import { useMutation } from 'react-query';
import AuthApiService from '../services/api-services/auth.service';
import { getUser } from '../store/slices/auth';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const mLogin = useMutation((data) => AuthApiService.loginAdmin(data), {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      dispatch(getUser(_.get(data, 'data')));
      navigate('/dashboard', { replace: true });
    },
  });

  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to Admin DashBoard
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}></Typography>

            <LoginForm onSubmit={(data) => mLogin.mutate(data)} loading={Boolean(_.get(mLogin, 'isLoading'))} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
