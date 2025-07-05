import { NextRequest, NextResponse } from 'next/server';
import { PostModel, SessionModel } from '@/lib/database';

const postModel = new PostModel();
const sessionModel = new SessionModel();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const platform = searchParams.get('platform');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    
    let posts;
    
    if (search) {
      posts = postModel.searchPosts(search, limit, offset);
    } else if (featured) {
      posts = postModel.getFeaturedPosts(limit);
    } else if (platform) {
      posts = postModel.getPostsByPlatform(platform, limit, offset);
    } else {
      posts = postModel.getAllPosts(limit, offset);
    }
    
    const totalCount = postModel.getPostCount();
    
    return NextResponse.json({
      posts,
      totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    let userId: number | undefined;
    
    // If token is provided, validate it and get user ID
    if (token) {
      const session = sessionModel.getSessionByToken(token);
      if (!session) {
        return NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        );
      }
      userId = session.user_id;
    }
    
    const postData = await request.json();
    
    if (!postData.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Set user_id if authenticated
    if (userId) {
      postData.user_id = userId;
    }
    
    const post = postModel.createPost(postData);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}