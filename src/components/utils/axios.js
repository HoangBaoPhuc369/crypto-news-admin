import axios from 'axios';

const axiosServices = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_BASE_URL,
});

export default axiosServices;
