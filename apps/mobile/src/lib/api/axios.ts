import axios from 'axios';
import type {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {zustandStorage} from '../storage';
import Config from 'react-native-config';
import {useAuthStore} from '../../auth/store';

// const BASE_URL = Config.API_URL;
const BASE_URL = 'http://localhost:3333';

export const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const source = axios.CancelToken.source();
  const headers = {} as Record<string, string>;

  const token = JSON.parse(zustandStorage.getItem('auth') as string)?.state
    ?.token;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  AXIOS_INSTANCE.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      return;
    }
    return Promise.reject(error);
  });

  const promise = AXIOS_INSTANCE({
    ...config,
    headers: {...config.headers, ...headers},
    ...options,
    cancelToken: source.token,
    baseURL: BASE_URL,
  }).then(data => data);

  // @ts-expect-error cancel exists
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
