import { NextRequest, NextResponse } from 'next/server';
import { UserModel, SessionModel } from '@/lib/database';

const userModel = new UserModel();
const sessionModel = new SessionModel();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Verify user credentials
    const user = await userModel.verifyPassword(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create session
    const session = sessionModel.createSession(user.id);
    
    // Remove password hash from user data
    const { password_hash, ...safeUser } = user;
    
    return NextResponse.json({
      user: safeUser,
      session: {
        token: session.session_token,
        expires_at: session.expires_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 400 }
      );
    }
    
    const success = sessionModel.deleteSession(token);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}