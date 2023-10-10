/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class SocialApiService {
  baseApi = 'https://cryptonew-v8jk.onrender.com/';

  getListSocial({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    /*
    
    
      ,
      {
        params: {
          page: _.get(data, 'index'),
          page_size: _.get(data, 'size'),
        },
      }
    */
    return axiosServices.get(`${this.baseApi}socials`, config);
  }

  createSocial({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.post(`${this.baseApi}socials`, data, config);
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
export default new SocialApiService();
