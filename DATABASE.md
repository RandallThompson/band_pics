# Database Implementation

This document describes the SQLite database implementation for the Buffalo Music Scene application.

## Overview

The application now includes a comprehensive SQLite database to store:
- **User information** - User accounts, profiles, and authentication data
- **Session data** - User login sessions and authentication tokens
- **Post data** - User posts, social media content, likes, and comments

## Database Schema

### Users Table
Stores user account information and profiles.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
Manages user authentication sessions.

```sql
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Posts Table
Stores user posts and social media content.

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    platform TEXT CHECK(platform IN ('facebook', 'instagram', 'twitter', 'native')) DEFAULT 'native',
    external_post_url TEXT,
    tags TEXT, -- JSON array of tags
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Post Likes Table
Tracks user likes on posts.

```sql
CREATE TABLE post_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);
```

### Post Comments Table
Stores user comments on posts.

```sql
CREATE TABLE post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Database Models

### UserModel (`src/lib/database/models/user.ts`)
Handles user-related database operations:
- `createUser(userData)` - Create new user with hashed password
- `getUserById(id)` - Get user by ID
- `getUserByEmail(email)` - Get user by email
- `getUserByUsername(username)` - Get user by username
- `updateUser(id, userData)` - Update user information
- `deleteUser(id)` - Delete user account
- `verifyPassword(email, password)` - Authenticate user
- `getAllUsers(limit, offset)` - Get paginated list of users

### SessionModel (`src/lib/database/models/session.ts`)
Manages user sessions:
- `createSession(userId, expiresInHours)` - Create new session
- `getSessionByToken(token)` - Get session by token
- `deleteSession(token)` - Delete session (logout)
- `deleteUserSessions(userId)` - Delete all user sessions
- `extendSession(token, expiresInHours)` - Extend session expiration
- `deleteExpiredSessions()` - Clean up expired sessions

### PostModel (`src/lib/database/models/post.ts`)
Handles posts and interactions:
- `createPost(postData)` - Create new post
- `getPostById(id)` - Get post by ID
- `getAllPosts(limit, offset)` - Get paginated public posts
- `getPostsByUser(userId)` - Get user's posts
- `getPostsByPlatform(platform)` - Get posts by platform
- `getFeaturedPosts(limit)` - Get featured posts
- `updatePost(id, postData)` - Update post
- `deletePost(id)` - Delete post
- `likePost(postId, userId)` - Like a post
- `unlikePost(postId, userId)` - Unlike a post
- `addComment(commentData)` - Add comment to post
- `deleteComment(id)` - Delete comment
- `searchPosts(query)` - Search posts by content

## API Routes

### Users API (`/api/users`)
- `GET /api/users` - Get all users (paginated)
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Sessions API (`/api/sessions`)
- `POST /api/sessions` - Login (create session)
- `DELETE /api/sessions` - Logout (delete session)
- `GET /api/sessions/validate` - Validate session token

### Posts API (`/api/posts`)
- `GET /api/posts` - Get posts (with filtering options)
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get specific post
- `PUT /api/posts/[id]` - Update post (owner only)
- `DELETE /api/posts/[id]` - Delete post (owner only)

## Usage Examples

### Creating a User
```typescript
import { UserModel } from '@/lib/database';

const userModel = new UserModel();
const user = await userModel.createUser({
  username: 'musiclover',
  email: 'user@example.com',
  password: 'securepassword',
  first_name: 'John',
  last_name: 'Doe'
});
```

### User Authentication
```typescript
import { UserModel, SessionModel } from '@/lib/database';

const userModel = new UserModel();
const sessionModel = new SessionModel();

// Verify credentials
const user = await userModel.verifyPassword('user@example.com', 'password');
if (user) {
  // Create session
  const session = sessionModel.createSession(user.id);
  console.log('Session token:', session.session_token);
}
```

### Creating a Post
```typescript
import { PostModel } from '@/lib/database';

const postModel = new PostModel();
const post = postModel.createPost({
  user_id: 1,
  title: 'Amazing Concert!',
  content: 'Just saw an incredible show at the local venue.',
  platform: 'native',
  tags: ['concert', 'live-music'],
  is_public: true
});
```

## Security Features

- **Password Hashing**: Uses bcryptjs with 12 salt rounds
- **Session Management**: UUID-based session tokens with expiration
- **SQL Injection Protection**: Uses prepared statements
- **Foreign Key Constraints**: Maintains data integrity
- **Input Validation**: API routes validate required fields

## Testing

The database implementation includes comprehensive tests:
- **Unit Tests** (`__tests__/database.test.ts`) - Test individual model methods
- **Integration Tests** (`__tests__/integration.test.ts`) - Test complete workflows

Run tests with:
```bash
npm test
```

## Database File

The SQLite database file is created at `band_pics.db` in the project root. For testing, separate database files are used to avoid conflicts.

## Dependencies

- `better-sqlite3` - SQLite database driver
- `bcryptjs` - Password hashing
- `uuid` - Session token generation
- `@types/*` - TypeScript type definitions