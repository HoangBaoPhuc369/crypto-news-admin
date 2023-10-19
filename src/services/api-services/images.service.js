/* eslint-disable lines-between-class-members */
import _ from 'lodash';
import axiosServices from '../../components/utils/axios';

class ImageApiService {
  baseApi = process.env.REACT_APP_API_URL;
  
  uploadImage(data) {
    const config = {
      headers: {
        Authorization: `Bearer ${_.get(data, 'token', '')}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosServices.post(
      `${this.baseApi}uploads/cloud/${_.get(data, 'path', '')}`,
      _.get(data, 'formData', null),
      config
    );
  }
}
export default new ImageApiService();
