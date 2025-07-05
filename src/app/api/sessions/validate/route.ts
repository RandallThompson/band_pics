import { NextRequest, NextResponse } from 'next/server';
import { SessionModel, UserModel } from '@/lib/database';

const sessionModel = new SessionModel();
const userModel = new UserModel();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 400 }
      );
    }
    
    const session = sessionModel.getSessionByToken(token);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    const user = userModel.getUserById(session.user_id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove password hash from user data
    const { password_hash, ...safeUser } = user;
    
    return NextResponse.json({
      valid: true,
      user: safeUser,
      session: {
        expires_at: session.expires_at
      }
    });
  } catch (error) {
    console.error('Error validating session:', error);
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    );
  }
}