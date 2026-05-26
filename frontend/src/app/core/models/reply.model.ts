import { User } from './user.model';

export interface Reply {
  id: number;
  body: string;
  user_id: number;
  thread_id: number;
  parent_id?: number | null;
  is_best: boolean;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'name' | 'avatar' | 'karma'>;
  children?: Reply[];
  user_vote?: 1 | -1 | null;
}
