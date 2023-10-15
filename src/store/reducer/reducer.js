/* eslint-disable import/order */
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthReducer from '../slices/auth';
import expireReducer from 'redux-persist-expire';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: 'user',
      storage,
      keyPrefix: 'admin-',
      transforms: [expireReducer('user', { expireSeconds: 7 * 24 * 60 * 60 })],
    },
    AuthReducer
  ),
});

export default reducer;
