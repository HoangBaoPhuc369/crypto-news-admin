/* eslint-disable lines-between-class-members */
import axiosServices from '../../components/utils/axios';

class AuthApiService {
  baseApi = 'https://cryptonew-v8jk.onrender.com/';

  loginAdmin(data) {
    return axiosServices.post(`${this.baseApi}auth/login`, data);
  }
}
export default new AuthApiService();
