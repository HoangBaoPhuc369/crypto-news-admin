/* eslint-disable import/order */
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthReducer from '../slices/auth';
import expireReducer from 'redux-persist-expire';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: AuthReducer,
});

export default reducer;
