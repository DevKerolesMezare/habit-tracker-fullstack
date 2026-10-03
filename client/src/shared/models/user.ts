export type AuthResponse = {
  userId: number;
  userName: string;
  email: string;
  token: string;
};

export type Login = {
  email: string;
  password: string;
};

export type Register = {
  userName: string;
  email: string;
  password: string;
};

export type UserInfo = {
  userId: number;
  userName: string;
  email: string;
};


