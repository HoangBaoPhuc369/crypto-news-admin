/* eslint-disable import/order */
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { Provider } from 'react-redux';
import { store, persister } from './store';
import { ToastContainer } from 'react-toastify';
import './style.css';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store} persister={persister}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ToastContainer limit={5} enableMultiContainer />
            <ScrollToTop />
            <StyledChart />
            <Router />
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}
