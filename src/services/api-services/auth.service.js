/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class AuthApiService {
  baseApi = process.env.REACT_APP_API_URL;

  loginAdmin(data) {
    return axiosServices.post(`${this.baseApi}auth/login`, data);
  }

  createUser({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.post(`${this.baseApi}users`, data, config);
  }

  getListUser({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(
      `${this.baseApi}users`,
      {
        params: {
          page: _.get(data, 'index'),
          page_size: _.get(data, 'size'),
        },
      },
      config
    );
  }

  deleteUser({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.delete(`${this.baseApi}users/${data}`, config);
  }

  updateUser({ data, token, userId }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.put(`${this.baseApi}users/${userId}`, data, config);
  }

  getUser({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}users/${data}`, config);
  }
}
export default new AuthApiService();
