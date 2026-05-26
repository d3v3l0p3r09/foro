export type UserRank = 'Novato' | 'Colaborador' | 'Leyenda';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  banner?: string | null;
  karma?: number;
  rank?: UserRank;
  provider?: string;
  is_admin?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileStats {
  threads_count: number;
  replies_count: number;
  karma: number;
  rank: UserRank;
}

export interface ProfileResponse {
  user: User;
  stats: ProfileStats;
}
