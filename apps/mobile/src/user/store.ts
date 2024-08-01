import {create} from 'zustand';
import {UserInterface} from '../lib/api/client.schemas';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from '../lib/storage';
import {createApi} from '../lib/api';
import {UpdateUserData, User} from './types';

type UserState = {
  user: UserInterface | undefined;
};

type UserActions = {
  get: () => Promise<void>;
  update: (data: UpdateUserData) => Promise<void>;
};

const api = createApi();

export const useUserStore = create<UserActions & UserState>()(
  persist(
    (set, get) => ({
      user: undefined,
      get: async () => {
        try {
          const response = await api.user.get();
          set({user: response.data as UserInterface | undefined});
        } catch (error) {
          console.error('[Get User]: ', error);
        }
      },
      update: async data => {
        const response = await api.user.edit(data);
        set({user: response.data as User});
      },
    }),
    {name: 'user', storage: createJSONStorage(() => zustandStorage)},
  ),
);
