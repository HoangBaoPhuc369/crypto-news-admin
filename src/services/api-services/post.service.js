/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class PostApiService {
  baseApi = 'https://cryptonew-v8jk.onrender.com/';

  getListSocial({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}socials`, config);
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
        Authorization: `Bearer ${_.get(data,'token', '')}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosServices.post(`${this.baseApi}uploads/stats`, _.get(data, 'formData', null), config);
  }


  getSocial({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}socials/${data}`, config);
  }

  updateSocial({ data, token, paramId }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.put(`${this.baseApi}socials/${paramId}`, data, config);
  }

  deleteSocial({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.delete(`${this.baseApi}socials/${data}`, config);
  }
}
export default new PostApiService();
