import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice';

const store = configureStore({
    reducer:{
        auth: authSlice      //It basically says, authSlice is registered under
    }                        //auth, and useSelector should access content by
})                           // state.auth.status or state.auth.userData
                             //because, blog app can have multipe reducers.
export default store;