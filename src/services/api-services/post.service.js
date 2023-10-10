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

  uploadImage({formData, token}) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosServices.post(`${this.baseApi}uploads/stats`, formData, config);
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
