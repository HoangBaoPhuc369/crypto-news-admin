/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class BannerApiService {
  baseApi = process.env.REACT_APP_API_URL;

  getListBanner({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axiosServices.get(
      `${this.baseApi}banners`,
      {
        params: {
          page: _.get(data, 'index'),
          page_size: _.get(data, 'size'),
        },
      },
      config
    );
  }

  getBanner({ data, token }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.get(`${this.baseApi}banners/${data}`, config);
  }

  updateBanner({ data, token, paramId }) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axiosServices.put(`${this.baseApi}banners/${paramId}`, data, config);
  }

}
export default new BannerApiService();
