import {NativeStackScreenProps} from '@react-navigation/native-stack';

export enum AuthRoutes {
  SIGN_UP = 'SignUp',
  LOGIN = 'Login',
}

export type AuthStackParamList = {
  [AuthRoutes.LOGIN]: undefined;
  [AuthRoutes.SIGN_UP]: undefined;
};


export type AuthStackScreenProps<
  RN extends keyof AuthStackParamList = AuthRoutes,
> = NativeStackScreenProps<AuthStackParamList, RN>;

export enum TabRoutes {
  POSTS = 'Posts',
  PROFILE = 'Profile',
}

export enum AppRoutes {
  TABS = 'Tabs',
  ADD_POST = 'AddPost',
  POST = 'Post',
}

export type AppStackParamList = {
  [AppRoutes.ADD_POST]: undefined;
  [AppRoutes.TABS]: undefined;
  [AppRoutes.POST]: {id: string};
};

export type TabsStackParamList = {
  [TabRoutes.POSTS]: undefined;
  [TabRoutes.PROFILE]: undefined;
  [AppRoutes.POST]: {id: string};
  [AppRoutes.ADD_POST]: undefined;
};

export enum ProfileRoutes {
  PROFILE = 'ProfileScreen',
  SETTINGS = 'Settings',
}

export type ProfileStackParamList = {
  [ProfileRoutes.PROFILE]: undefined;
  [ProfileRoutes.SETTINGS]: undefined;
};

export type ProfileStackScreenProps<
  RN extends keyof ProfileStackParamList = ProfileRoutes,
> = NativeStackScreenProps<ProfileStackParamList, RN>;

export type TabStackScreenProps<
  RT extends keyof TabsStackParamList = TabRoutes,
> = NativeStackScreenProps<TabsStackParamList, RT>;

export type AppStackScreenProps<
  RT extends keyof AppStackParamList = AppRoutes,
> = NativeStackScreenProps<AppStackParamList, RT>;