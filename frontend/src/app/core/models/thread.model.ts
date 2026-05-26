import { User } from './user.model';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export type ThreadSort = 'recent' | 'top' | 'unresolved';

export interface Thread {
  id: number;
  title: string;
  body: string;
  user_id: number;
  category_id: number;
  upvotes: number;
  downvotes: number;
  views: number;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'name' | 'avatar' | 'karma'>;
  category?: Category;
  replies_count?: number;
  is_bookmarked?: boolean;
  user_vote?: 1 | -1 | null;
}

export interface PaginatedThreads {
  data: Thread[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  score: number;
  user_vote: 1 | -1 | null;
}
