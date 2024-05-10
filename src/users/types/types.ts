export interface UpdatePermissions {
  id: string;
  permission: string;
}

export interface CreateUser {
  nickname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface CreateGoogleUser {
  id: string;
  nickname: string;
  email: string;
  password: string;
  phoneNumber: string;
  profileImage: string;
}
