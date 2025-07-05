import { NextRequest, NextResponse } from 'next/server';
import { PostModel, SessionModel } from '@/lib/database';

const postModel = new PostModel();
const sessionModel = new SessionModel();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const post = postModel.getPostById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const session = sessionModel.getSessionByToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    const existingPost = postModel.getPostById(postId);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the post
    if (existingPost.user_id !== session.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized to edit this post' },
        { status: 403 }
      );
    }
    
    const postData = await request.json();
    const updatedPost = postModel.updatePost(postId, postData);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const session = sessionModel.getSessionByToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    const existingPost = postModel.getPostById(postId);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the post
    if (existingPost.user_id !== session.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      );
    }
    
    const success = postModel.deletePost(postId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}