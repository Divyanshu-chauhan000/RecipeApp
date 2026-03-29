import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api =  axios.create({
  baseURL: 'http://10.0.2.2:5001/api'
})

api.interceptors.request.use( async (config) =>{
    if(!config.skipAuth){
      const token =  await SecureStore.getItemAsync('userToken');
      if(token){
        config.headers = config.headers  || {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    return config;
})

api.interceptors.response.use(
  res => res,
  async (error) =>{
    if(error.response?.status === 401 && !error.config.skipAuth){
      // await SecureStore.deleteItemAsync('userToken');
    }
    return Promise.reject(error)
  }
)

export default api;