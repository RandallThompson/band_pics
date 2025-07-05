import { UserModel, SessionModel, PostModel } from '../src/lib/database';
import { unlinkSync } from 'fs';
import { join } from 'path';

// Use a test database
const testDbPath = join(process.cwd(), 'test_band_pics.db');

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

describe('Database Models', () => {
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

  describe('UserModel', () => {
    test('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      };

      const user = await userModel.createUser(userData);

      expect(user.id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.first_name).toBe(userData.first_name);
      expect(user.last_name).toBe(userData.last_name);
      expect(user.password_hash).toBeDefined();
      expect(user.password_hash).not.toBe(userData.password);
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });

    test('should get user by ID', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123'
      };

      const createdUser = await userModel.createUser(userData);
      const retrievedUser = userModel.getUserById(createdUser.id);

      expect(retrievedUser).toEqual(createdUser);
    });

    test('should get user by email', async () => {
      const userData = {
        username: 'testuser3',
        email: 'test3@example.com',
        password: 'password123'
      };

      const createdUser = await userModel.createUser(userData);
      const retrievedUser = userModel.getUserByEmail(userData.email);

      expect(retrievedUser).toEqual(createdUser);
    });

    test('should verify password correctly', async () => {
      const userData = {
        username: 'testuser4',
        email: 'test4@example.com',
        password: 'password123'
      };

      await userModel.createUser(userData);
      
      const validUser = await userModel.verifyPassword(userData.email, userData.password);
      expect(validUser).toBeTruthy();
      expect(validUser?.email).toBe(userData.email);

      const invalidUser = await userModel.verifyPassword(userData.email, 'wrongpassword');
      expect(invalidUser).toBeNull();
    });

    test('should update user information', async () => {
      const userData = {
        username: 'testuser5',
        email: 'test5@example.com',
        password: 'password123'
      };

      const createdUser = await userModel.createUser(userData);
      
      const updateData = {
        first_name: 'Updated',
        last_name: 'Name',
        bio: 'Updated bio'
      };

      const updatedUser = await userModel.updateUser(createdUser.id, updateData);

      expect(updatedUser?.first_name).toBe(updateData.first_name);
      expect(updatedUser?.last_name).toBe(updateData.last_name);
      expect(updatedUser?.bio).toBe(updateData.bio);
      expect(updatedUser?.username).toBe(userData.username);
      expect(updatedUser?.email).toBe(userData.email);
    });

    test('should delete user', async () => {
      const userData = {
        username: 'testuser6',
        email: 'test6@example.com',
        password: 'password123'
      };

      const createdUser = await userModel.createUser(userData);
      const deleteResult = userModel.deleteUser(createdUser.id);
      
      expect(deleteResult).toBe(true);
      
      const retrievedUser = userModel.getUserById(createdUser.id);
      expect(retrievedUser).toBeFalsy();
    });
  });

  describe('SessionModel', () => {
    let testUser: any;

    beforeEach(async () => {
      const userData = {
        username: 'sessionuser',
        email: 'session@example.com',
        password: 'password123'
      };
      testUser = await userModel.createUser(userData);
    });

    test('should create a session', () => {
      const session = sessionModel.createSession(testUser.id);

      expect(session.id).toBeDefined();
      expect(session.user_id).toBe(testUser.id);
      expect(session.session_token).toBeDefined();
      expect(session.expires_at).toBeDefined();
      expect(session.created_at).toBeDefined();
    });

    test('should get session by token', () => {
      const session = sessionModel.createSession(testUser.id);
      const retrievedSession = sessionModel.getSessionByToken(session.session_token);

      expect(retrievedSession).toEqual(session);
    });

    test('should not return expired sessions', () => {
      const session = sessionModel.createSession(testUser.id, -1); // Expired 1 hour ago
      const retrievedSession = sessionModel.getSessionByToken(session.session_token);

      expect(retrievedSession).toBeFalsy();
    });

    test('should delete session', () => {
      const session = sessionModel.createSession(testUser.id);
      const deleteResult = sessionModel.deleteSession(session.session_token);

      expect(deleteResult).toBe(true);

      const retrievedSession = sessionModel.getSessionByToken(session.session_token);
      expect(retrievedSession).toBeFalsy();
    });

    test('should extend session', () => {
      const session = sessionModel.createSession(testUser.id, 1); // 1 hour
      const extendedSession = sessionModel.extendSession(session.session_token, 24); // 24 hours

      expect(extendedSession).toBeTruthy();
      expect(new Date(extendedSession!.expires_at).getTime()).toBeGreaterThan(new Date(session.expires_at).getTime());
    });
  });

  describe('PostModel', () => {
    let testUser: any;

    beforeEach(async () => {
      const userData = {
        username: 'postuser',
        email: 'post@example.com',
        password: 'password123'
      };
      testUser = await userModel.createUser(userData);
    });

    test('should create a post', () => {
      const postData = {
        user_id: testUser.id,
        title: 'Test Post',
        content: 'This is a test post content',
        platform: 'native' as const,
        is_public: true
      };

      const post = postModel.createPost(postData);

      expect(post.id).toBeDefined();
      expect(post.user_id).toBe(testUser.id);
      expect(post.title).toBe(postData.title);
      expect(post.content).toBe(postData.content);
      expect(post.platform).toBe(postData.platform);
      expect(post.is_public).toBe(1); // SQLite stores booleans as integers
      expect(post.likes_count).toBe(0);
      expect(post.comments_count).toBe(0);
      expect(post.created_at).toBeDefined();
    });

    test('should get post by ID', () => {
      const postData = {
        user_id: testUser.id,
        content: 'Test content',
        platform: 'facebook' as const
      };

      const createdPost = postModel.createPost(postData);
      const retrievedPost = postModel.getPostById(createdPost.id);

      expect(retrievedPost).toEqual(createdPost);
    });

    test('should get posts by user', () => {
      const postData1 = {
        user_id: testUser.id,
        content: 'User post 1',
        platform: 'native' as const
      };

      const postData2 = {
        user_id: testUser.id,
        content: 'User post 2',
        platform: 'instagram' as const
      };

      postModel.createPost(postData1);
      postModel.createPost(postData2);

      const userPosts = postModel.getPostsByUser(testUser.id);

      expect(userPosts).toHaveLength(2);
      expect(userPosts[0].user_id).toBe(testUser.id);
      expect(userPosts[1].user_id).toBe(testUser.id);
    });

    test('should get posts by platform', () => {
      const postData1 = {
        user_id: testUser.id,
        content: 'Facebook post',
        platform: 'facebook' as const
      };

      const postData2 = {
        user_id: testUser.id,
        content: 'Instagram post',
        platform: 'instagram' as const
      };

      postModel.createPost(postData1);
      postModel.createPost(postData2);

      const facebookPosts = postModel.getPostsByPlatform('facebook');
      const instagramPosts = postModel.getPostsByPlatform('instagram');

      expect(facebookPosts).toHaveLength(1);
      expect(facebookPosts[0].platform).toBe('facebook');
      expect(instagramPosts).toHaveLength(1);
      expect(instagramPosts[0].platform).toBe('instagram');
    });

    test('should like and unlike posts', () => {
      const postData = {
        user_id: testUser.id,
        content: 'Likeable post',
        platform: 'native' as const
      };

      const post = postModel.createPost(postData);

      // Like the post
      const likeResult = postModel.likePost(post.id, testUser.id);
      expect(likeResult).toBe(true);

      // Check likes count updated
      const updatedPost = postModel.getPostById(post.id);
      expect(updatedPost?.likes_count).toBe(1);

      // Unlike the post
      const unlikeResult = postModel.unlikePost(post.id, testUser.id);
      expect(unlikeResult).toBe(true);

      // Check likes count updated
      const finalPost = postModel.getPostById(post.id);
      expect(finalPost?.likes_count).toBe(0);
    });

    test('should add and delete comments', () => {
      const postData = {
        user_id: testUser.id,
        content: 'Commentable post',
        platform: 'native' as const
      };

      const post = postModel.createPost(postData);

      // Add comment
      const commentData = {
        post_id: post.id,
        user_id: testUser.id,
        content: 'This is a test comment'
      };

      const comment = postModel.addComment(commentData);
      expect(comment.id).toBeDefined();
      expect(comment.content).toBe(commentData.content);

      // Check comments count updated
      const updatedPost = postModel.getPostById(post.id);
      expect(updatedPost?.comments_count).toBe(1);

      // Get comments
      const comments = postModel.getPostComments(post.id);
      expect(comments).toHaveLength(1);
      expect(comments[0].content).toBe(commentData.content);

      // Delete comment
      const deleteResult = postModel.deleteComment(comment.id);
      expect(deleteResult).toBe(true);

      // Check comments count updated
      const finalPost = postModel.getPostById(post.id);
      expect(finalPost?.comments_count).toBe(0);
    });

    test('should search posts', () => {
      const postData1 = {
        user_id: testUser.id,
        title: 'Amazing Concert',
        content: 'This was an amazing rock concert',
        platform: 'native' as const
      };

      const postData2 = {
        user_id: testUser.id,
        title: 'Jazz Night',
        content: 'Great jazz performance last night',
        platform: 'native' as const
      };

      postModel.createPost(postData1);
      postModel.createPost(postData2);

      const searchResults = postModel.searchPosts('amazing');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toBe('Amazing Concert');

      const jazzResults = postModel.searchPosts('jazz');
      expect(jazzResults).toHaveLength(1);
      expect(jazzResults[0].title).toBe('Jazz Night');
    });
  });
});