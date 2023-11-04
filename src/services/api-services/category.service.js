/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class CategoryApiService {
  baseApi = process.env.REACT_APP_API_URL;

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
          local: _.get(data, 'local'),
        },
      },
      config
    );
  }

  getAllListCategory(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(
      `${this.baseApi}categories`,
      {
        params: {
          local: 'en',
        },
      },
      config
    );
  }

  getAllListCategoryJP(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}categories?local=jp`, config);
  }

  getAllListTags(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}tags`, config);
  }

  createCategory({ data, token }) {
    console.log(data);
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
    return axiosServices.get(
      `${this.baseApi}categories/${data}`,
      {
        params: {
          include: 'languages',
        },
      },
      config
    );
  }

  updateCategory({ data, token, paramId }) {
    // console.log(data);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.put(`${this.baseApi}categories/${paramId}`, data, config);
  }

  deleteCategory({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.delete(`${this.baseApi}categories/${data}`, config);
  }
}
export default new CategoryApiService();
