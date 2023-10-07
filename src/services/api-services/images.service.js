/* eslint-disable lines-between-class-members */
import axiosServices from '../../components/utils/axios';

class ImageApiService {
  baseApi = 'https://cryptonew-v8jk.onrender.com/';
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWVjNDViNjlhMWE4OGMxMjIzYzFkZSIsImlhdCI6MTY5NjY3MDg0NywiZXhwIjoxNjk3Mjc1NjQ3fQ.4ocEJ5S0dkK9kF2SpGaUnK0LNl8HTfgnb82m0taT1DM';

  uploadImage(formData) {
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosServices.post(`${this.baseApi}uploads/stats`, formData, config);
  }
}
export default new ImageApiService();
