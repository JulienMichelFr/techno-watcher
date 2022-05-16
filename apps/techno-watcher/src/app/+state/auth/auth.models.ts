export interface AuthStateUserProfile {
  username: string;
  id: number;
}

export interface AuthState {
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  profile: AuthStateUserProfile | null;
  expireAt: number | null;
}
