export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  bio?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  bio?: string;
}

export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface CreateSessionData {
  user_id: number;
  session_token: string;
  expires_at: Date;
}

export interface Post {
  id: number;
  user_id?: number;
  title?: string;
  content: string;
  image_url?: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'native';
  external_post_url?: string;
  tags?: string; // JSON array of tags
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  user_id?: number;
  title?: string;
  content: string;
  image_url?: string;
  platform?: 'facebook' | 'instagram' | 'twitter' | 'native';
  external_post_url?: string;
  tags?: string[];
  is_featured?: boolean;
  is_public?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  image_url?: string;
  platform?: 'facebook' | 'instagram' | 'twitter' | 'native';
  external_post_url?: string;
  tags?: string[];
  is_featured?: boolean;
  is_public?: boolean;
}

export interface PostLike {
  id: number;
  post_id: number;
  user_id: number;
  created_at: string;
}

export interface PostComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  post_id: number;
  user_id: number;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface Photo {
  id: number;
  user_id: number;
  event_id?: number;
  blob_url: string;
  caption?: string;
  alt_text?: string;
  genre?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePhotoData {
  user_id: number;
  event_id?: number;
  blob_url: string;
  caption?: string;
  alt_text?: string;
  genre?: string;
  is_public?: boolean;
}

export interface UpdatePhotoData {
  caption?: string;
  alt_text?: string;
  genre?: string;
  is_public?: boolean;
}