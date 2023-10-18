/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class PostApiService {
  baseApi = 'https://cryptonew-v8jk.onrender.com/';

  getListPost({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const params = {
      page: _.get(data, 'index', 1),
      page_size: _.get(data, 'size', 5),
      key_word: _.get(data, 'searchText', ''),
      local: _.get(data, 'language', ''),
    };

    const result = _.pickBy(params, _.identity);
    return axiosServices.get(
      `${this.baseApi}admin/posts`,
      {
        params: result,
      },
      config
    );
  }

  createPost({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.post(`${this.baseApi}posts`, data, config);
  }

  uploadImage(data) {
    // console.log(data);
    const config = {
      headers: {
        Authorization: `Bearer ${_.get(data, 'token', '')}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosServices.post(`${this.baseApi}uploads/stats`, _.get(data, 'formData', null), config);
  }

  getPost({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(
      `${this.baseApi}admin/posts/${_.get(data, 'id')}`,
      {
        params: {
          local: _.get(data, 'local'),
        },
      },
      config
    );
  }

  updatePost({ data, token, paramId }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.put(`${this.baseApi}posts/${paramId}`, data, config);
  }

  publishPost({ paramId, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.patch(`${this.baseApi}posts/${paramId}/publish`, null, config);
  }

  deletePost({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.delete(`${this.baseApi}posts/${data}`, config);
  }
}
export default new PostApiService();
