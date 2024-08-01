export type CreateAccountData = {
  password: string;
  email: string;
  username: string;
  confirmPassword: string;
};

export type LoginData = {
  username: string;
  password: string;
};
