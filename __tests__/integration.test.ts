import { UserModel, SessionModel, PostModel } from '../src/lib/database';
import { unlinkSync } from 'fs';
import { join } from 'path';

// Use a test database
const testDbPath = join(process.cwd(), 'test_integration_band_pics.db');

// Mock the database path for testing
jest.mock('../src/lib/database/connection', () => {
  const Database = require('better-sqlite3');
  const { readFileSync } = require('fs');
  const { join } = require('path');
  
  let db: any = null;
  
  return {
    getDatabase: () => {
      if (!db) {
        db = new Database(testDbPath);
        db.pragma('foreign_keys = ON');
        
        // Initialize test database schema
        const schemaPath = join(__dirname, '../src/lib/database/schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter((stmt: string) => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            db.exec(statement);
          }
        }
      }
      return db;
    },
    closeDatabase: () => {
      if (db) {
        db.close();
        db = null;
      }
    }
  };
});

describe('Database Integration Tests', () => {
  let userModel: UserModel;
  let sessionModel: SessionModel;
  let postModel: PostModel;

  beforeEach(() => {
    userModel = new UserModel();
    sessionModel = new SessionModel();
    postModel = new PostModel();
    
    // Clean up test data
    const db = require('../src/lib/database/connection').getDatabase();
    db.exec('DELETE FROM post_comments');
    db.exec('DELETE FROM post_likes');
    db.exec('DELETE FROM posts');
    db.exec('DELETE FROM sessions');
    db.exec('DELETE FROM users');
  });

  afterAll(() => {
    const { closeDatabase } = require('../src/lib/database/connection');
    closeDatabase();
    
    // Clean up test database file
    try {
      unlinkSync(testDbPath);
    } catch (error) {
      // File might not exist, ignore error
    }
  });

  describe('Complete User Workflow', () => {
    test('should handle complete user registration and authentication flow', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      };

      // 1. Create user
      const user = await userModel.createUser(userData);
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.first_name).toBe(userData.first_name);
      expect(user.password_hash).toBeDefined();
      expect(user.password_hash).not.toBe(userData.password);

      // 2. Verify password authentication
      const authenticatedUser = await userModel.verifyPassword(userData.email, userData.password);
      expect(authenticatedUser).toBeTruthy();
      expect(authenticatedUser?.id).toBe(user.id);

      // 3. Create session for authenticated user
      const session = sessionModel.createSession(user.id);
      expect(session.user_id).toBe(user.id);
      expect(session.session_token).toBeDefined();
      expect(session.expires_at).toBeDefined();

      // 4. Validate session token
      const validSession = sessionModel.getSessionByToken(session.session_token);
      expect(validSession).toBeTruthy();
      expect(validSession?.user_id).toBe(user.id);

      // 5. Update user profile
      const updateData = {
        bio: 'Music lover and photographer',
        profile_image_url: 'https://example.com/profile.jpg'
      };
      const updatedUser = await userModel.updateUser(user.id, updateData);
      expect(updatedUser?.bio).toBe(updateData.bio);
      expect(updatedUser?.profile_image_url).toBe(updateData.profile_image_url);

      // 6. Logout (delete session)
      const deleteResult = sessionModel.deleteSession(session.session_token);
      expect(deleteResult).toBe(true);

      // 7. Verify session is no longer valid
      const invalidSession = sessionModel.getSessionByToken(session.session_token);
      expect(invalidSession).toBeFalsy();
    });

    test('should prevent duplicate user registration', async () => {
      const userData = {
        username: 'duplicate',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create first user
      await userModel.createUser(userData);

      // Try to create user with same email
      const duplicateEmailData = {
        username: 'different',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await expect(userModel.createUser(duplicateEmailData)).rejects.toThrow();

      // Try to create user with same username
      const duplicateUsernameData = {
        username: 'duplicate',
        email: 'different@example.com',
        password: 'password123'
      };

      await expect(userModel.createUser(duplicateUsernameData)).rejects.toThrow();
    });
  });

  describe('Complete Post Workflow', () => {
    let testUser: any;
    let testSession: any;

    beforeEach(async () => {
      const userData = {
        username: 'postuser',
        email: 'post@example.com',
        password: 'password123'
      };
      testUser = await userModel.createUser(userData);
      testSession = sessionModel.createSession(testUser.id);
    });

    test('should handle complete post creation and interaction flow', async () => {
      // 1. Create a post
      const postData = {
        user_id: testUser.id,
        title: 'Amazing Concert Last Night',
        content: 'Just saw an incredible performance at the local venue. The energy was electric!',
        platform: 'native' as const,
        tags: ['concert', 'live-music', 'rock'],
        is_public: true,
        is_featured: false
      };

      const post = postModel.createPost(postData);
      expect(post.title).toBe(postData.title);
      expect(post.content).toBe(postData.content);
      expect(post.user_id).toBe(testUser.id);
      expect(post.likes_count).toBe(0);
      expect(post.comments_count).toBe(0);

      // 2. Like the post
      const likeResult = postModel.likePost(post.id, testUser.id);
      expect(likeResult).toBe(true);

      // Verify likes count updated
      const likedPost = postModel.getPostById(post.id);
      expect(likedPost?.likes_count).toBe(1);

      // 3. Add a comment
      const commentData = {
        post_id: post.id,
        user_id: testUser.id,
        content: 'I was there too! What an amazing show!'
      };

      const comment = postModel.addComment(commentData);
      expect(comment.content).toBe(commentData.content);
      expect(comment.user_id).toBe(testUser.id);

      // Verify comments count updated
      const commentedPost = postModel.getPostById(post.id);
      expect(commentedPost?.comments_count).toBe(1);

      // 4. Get post comments
      const comments = postModel.getPostComments(post.id);
      expect(comments).toHaveLength(1);
      expect(comments[0].content).toBe(commentData.content);

      // 5. Update the post
      const updateData = {
        title: 'Updated: Amazing Concert Last Night',
        is_featured: true
      };

      const updatedPost = postModel.updatePost(post.id, updateData);
      expect(updatedPost?.title).toBe(updateData.title);
      expect(updatedPost?.is_featured).toBe(1); // SQLite boolean as integer

      // 6. Search for posts
      const searchResults = postModel.searchPosts('amazing');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].id).toBe(post.id);

      // 7. Get featured posts
      const featuredPosts = postModel.getFeaturedPosts();
      expect(featuredPosts).toHaveLength(1);
      expect(featuredPosts[0].id).toBe(post.id);
    });

    test('should handle social media posts from different platforms', async () => {
      // Create posts from different platforms
      const facebookPost = postModel.createPost({
        content: 'Check out this amazing band!',
        platform: 'facebook',
        external_post_url: 'https://facebook.com/post/123',
        is_public: true
      });

      const instagramPost = postModel.createPost({
        content: 'Great concert vibes! 🎵',
        platform: 'instagram',
        image_url: 'https://instagram.com/image/456',
        external_post_url: 'https://instagram.com/p/456',
        is_public: true
      });

      const nativePost = postModel.createPost({
        user_id: testUser.id,
        title: 'My Concert Review',
        content: 'Here\'s my detailed review of last night\'s show...',
        platform: 'native',
        is_public: true
      });

      // Test platform filtering
      const facebookPosts = postModel.getPostsByPlatform('facebook');
      expect(facebookPosts).toHaveLength(1);
      expect(facebookPosts[0].platform).toBe('facebook');

      const instagramPosts = postModel.getPostsByPlatform('instagram');
      expect(instagramPosts).toHaveLength(1);
      expect(instagramPosts[0].platform).toBe('instagram');

      const nativePosts = postModel.getPostsByPlatform('native');
      expect(nativePosts).toHaveLength(1);
      expect(nativePosts[0].platform).toBe('native');

      // Test getting all posts
      const allPosts = postModel.getAllPosts();
      expect(allPosts).toHaveLength(3);
    });
  });

  describe('Session Management', () => {
    let testUser: any;

    beforeEach(async () => {
      const userData = {
        username: 'sessionuser',
        email: 'session@example.com',
        password: 'password123'
      };
      testUser = await userModel.createUser(userData);
    });

    test('should handle multiple sessions for same user', async () => {
      // Create multiple sessions
      const session1 = sessionModel.createSession(testUser.id, 24); // 24 hours
      const session2 = sessionModel.createSession(testUser.id, 48); // 48 hours

      expect(session1.user_id).toBe(testUser.id);
      expect(session2.user_id).toBe(testUser.id);
      expect(session1.session_token).not.toBe(session2.session_token);

      // Get all user sessions
      const userSessions = sessionModel.getUserSessions(testUser.id);
      expect(userSessions).toHaveLength(2);

      // Delete one session
      const deleteResult = sessionModel.deleteSession(session1.session_token);
      expect(deleteResult).toBe(true);

      // Verify only one session remains
      const remainingSessions = sessionModel.getUserSessions(testUser.id);
      expect(remainingSessions).toHaveLength(1);
      expect(remainingSessions[0].session_token).toBe(session2.session_token);

      // Delete all user sessions
      const deletedCount = sessionModel.deleteUserSessions(testUser.id);
      expect(deletedCount).toBe(1);

      // Verify no sessions remain
      const finalSessions = sessionModel.getUserSessions(testUser.id);
      expect(finalSessions).toHaveLength(0);
    });

    test('should handle session expiration', async () => {
      // Create expired session
      const expiredSession = sessionModel.createSession(testUser.id, -1); // Expired 1 hour ago
      
      // Try to get expired session
      const retrievedSession = sessionModel.getSessionByToken(expiredSession.session_token);
      expect(retrievedSession).toBeFalsy();

      // Create valid session
      const validSession = sessionModel.createSession(testUser.id, 24);
      
      // Extend session
      const extendedSession = sessionModel.extendSession(validSession.session_token, 48);
      expect(extendedSession).toBeTruthy();
      expect(new Date(extendedSession!.expires_at).getTime()).toBeGreaterThan(new Date(validSession.expires_at).getTime());

      // Clean up expired sessions
      const cleanedCount = sessionModel.deleteExpiredSessions();
      expect(cleanedCount).toBeGreaterThanOrEqual(1); // Should clean up the expired session
    });
  });
});