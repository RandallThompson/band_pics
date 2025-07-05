import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/database';

const userModel = new UserModel();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const users = userModel.getAllUsers(limit, offset);
    const totalCount = userModel.getUserCount();
    
    // Remove password hashes from response
    const safeUsers = users.map(({ password_hash, ...user }) => user);
    
    return NextResponse.json({
      users: safeUsers,
      totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = userModel.getUserByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    const existingUsername = userModel.getUserByUsername(userData.username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }
    
    const user = await userModel.createUser(userData);
    
    // Remove password hash from response
    const { password_hash, ...safeUser } = user;
    
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}