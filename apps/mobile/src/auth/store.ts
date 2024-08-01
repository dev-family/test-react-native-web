import {create} from 'zustand';
import {CreateAccountData, LoginData} from './types';
import {createApi} from '../lib/api';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from '../lib/storage';
import {AxiosError} from 'axios';

type AuthState = {
  token: string;
  loading: boolean;
};

type VineError = {field: string; message: string};
type ResultType = {
  errors?: VineError[];
  result: 'success' | 'failure';
};

type AuthActions = {
  login: (data: LoginData) => Promise<string | void>;
  register: (data: CreateAccountData) => Promise<ResultType>;
  logout: () => void;
  setLoading: (flag: boolean) => void;
};
const initialState: AuthState = {
  token: '',
  loading: false,
};

const api = createApi();

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async data => {
        set({loading: true});
        try {
          const response = await api.auth.login(data);

          set({token: response.data.token, loading: false});
        } catch (error) {
          set({loading: false});
          throw error;
        }
      },

      register: async data => {
        set({loading: true});
        try {
          const response = await api.auth.register(data);
          set({token: response.data.token, loading: false});
          return {result: 'success'};
        } catch (e) {
          set({loading: false});
          const error = e as AxiosError<{errors: VineError[]}>;

          if (error.response?.data.errors) {
            const errors = error.response.data.errors;
            return {errors, result: 'failure'};
          }
          return {result: 'failure'};
        }
      },

      logout: async () => {
        try {
          await api.auth.logout();
          set(initialState);
        } catch (error) {
          set(initialState);
        }
      },
      setLoading: loading => {
        set({loading});
      },
    }),
    {name: 'auth', storage: createJSONStorage(() => zustandStorage)},
  ),
);
