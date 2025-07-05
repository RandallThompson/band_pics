import { getDatabase } from '../connection';
import { Post, CreatePostData, UpdatePostData, PostLike, PostComment, CreateCommentData, UpdateCommentData } from '../types';

export class PostModel {
  private db = getDatabase();

  createPost(postData: CreatePostData): Post {
    const stmt = this.db.prepare(`
      INSERT INTO posts (
        user_id, title, content, image_url, platform, external_post_url, 
        tags, is_featured, is_public
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const tagsJson = postData.tags ? JSON.stringify(postData.tags) : null;
    
    const result = stmt.run(
      postData.user_id || null,
      postData.title || null,
      postData.content,
      postData.image_url || null,
      postData.platform || 'native',
      postData.external_post_url || null,
      tagsJson,
      postData.is_featured ? 1 : 0,
      postData.is_public !== false ? 1 : 0
    );
    
    const post = this.getPostById(result.lastInsertRowid as number);
    if (!post) {
      throw new Error('Failed to create post');
    }
    
    return post;
  }

  getPostById(id: number): Post | null {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?');
    return stmt.get(id) as Post | null;
  }

  getAllPosts(limit: number = 50, offset: number = 0): Post[] {
    const stmt = this.db.prepare(`
      SELECT * FROM posts 
      WHERE is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset) as Post[];
  }

  getPostsByUser(userId: number, limit: number = 50, offset: number = 0): Post[] {
    const stmt = this.db.prepare(`
      SELECT * FROM posts 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset) as Post[];
  }

  getPostsByPlatform(platform: string, limit: number = 50, offset: number = 0): Post[] {
    const stmt = this.db.prepare(`
      SELECT * FROM posts 
      WHERE platform = ? AND is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(platform, limit, offset) as Post[];
  }

  getFeaturedPosts(limit: number = 10): Post[] {
    const stmt = this.db.prepare(`
      SELECT * FROM posts 
      WHERE is_featured = 1 AND is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit) as Post[];
  }

  updatePost(id: number, postData: UpdatePostData): Post | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(postData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags' && Array.isArray(value)) {
          updates.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else if (key === 'is_featured' || key === 'is_public') {
          updates.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) {
      return this.getPostById(id);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE posts 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getPostById(id);
  }

  deletePost(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Like functionality
  likePost(postId: number, userId: number): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO post_likes (post_id, user_id)
        VALUES (?, ?)
      `);
      stmt.run(postId, userId);
      
      // Update likes count
      this.updateLikesCount(postId);
      return true;
    } catch (error) {
      // Likely a duplicate like (unique constraint violation)
      return false;
    }
  }

  unlikePost(postId: number, userId: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM post_likes 
      WHERE post_id = ? AND user_id = ?
    `);
    const result = stmt.run(postId, userId);
    
    if (result.changes > 0) {
      this.updateLikesCount(postId);
      return true;
    }
    return false;
  }

  private updateLikesCount(postId: number): void {
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?
    `);
    const { count } = countStmt.get(postId) as { count: number };
    
    const updateStmt = this.db.prepare(`
      UPDATE posts SET likes_count = ? WHERE id = ?
    `);
    updateStmt.run(count, postId);
  }

  // Comment functionality
  addComment(commentData: CreateCommentData): PostComment {
    const stmt = this.db.prepare(`
      INSERT INTO post_comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(
      commentData.post_id,
      commentData.user_id,
      commentData.content
    );
    
    // Update comments count
    this.updateCommentsCount(commentData.post_id);
    
    const comment = this.getCommentById(result.lastInsertRowid as number);
    if (!comment) {
      throw new Error('Failed to create comment');
    }
    
    return comment;
  }

  getCommentById(id: number): PostComment | null {
    const stmt = this.db.prepare('SELECT * FROM post_comments WHERE id = ?');
    return stmt.get(id) as PostComment | null;
  }

  getPostComments(postId: number, limit: number = 50, offset: number = 0): PostComment[] {
    const stmt = this.db.prepare(`
      SELECT * FROM post_comments 
      WHERE post_id = ? 
      ORDER BY created_at ASC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(postId, limit, offset) as PostComment[];
  }

  updateComment(id: number, commentData: UpdateCommentData): PostComment | null {
    const stmt = this.db.prepare(`
      UPDATE post_comments 
      SET content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(commentData.content, id);
    return this.getCommentById(id);
  }

  deleteComment(id: number): boolean {
    // Get the post_id before deleting
    const comment = this.getCommentById(id);
    if (!comment) return false;
    
    const stmt = this.db.prepare('DELETE FROM post_comments WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes > 0) {
      this.updateCommentsCount(comment.post_id);
      return true;
    }
    return false;
  }

  private updateCommentsCount(postId: number): void {
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM post_comments WHERE post_id = ?
    `);
    const { count } = countStmt.get(postId) as { count: number };
    
    const updateStmt = this.db.prepare(`
      UPDATE posts SET comments_count = ? WHERE id = ?
    `);
    updateStmt.run(count, postId);
  }

  searchPosts(query: string, limit: number = 50, offset: number = 0): Post[] {
    const stmt = this.db.prepare(`
      SELECT * FROM posts 
      WHERE (title LIKE ? OR content LIKE ?) AND is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, limit, offset) as Post[];
  }

  getPostCount(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM posts WHERE is_public = 1');
    const result = stmt.get() as { count: number };
    return result.count;
  }
}