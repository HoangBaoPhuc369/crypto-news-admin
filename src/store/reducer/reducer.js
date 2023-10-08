import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthReducer from '../slices/auth';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: 'user',
      storage,
      keyPrefix: 'admin-',
    },
    AuthReducer
  ),
});

export default reducer;
