/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class CategoryApiService {
  baseApi = 'https://cryptonew-v8jk.onrender.com/';

  getListCategory({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(
      `${this.baseApi}categories`,
      {
        params: {
          page: _.get(data, 'index'),
          page_size: _.get(data, 'size'),
        },
      },
      config
    );
  }

  createCategory({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.post(`${this.baseApi}categories`, data, config);
  }

  getCategory({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}categories/${data}`, config);
  }

  updateCategory({ data, token, paramId }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.put(`${this.baseApi}categories/${paramId}`, data, config);
  }
}
export default new CategoryApiService();
