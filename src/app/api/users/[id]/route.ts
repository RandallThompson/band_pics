import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/database';

const userModel = new UserModel();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const user = userModel.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove password hash from response
    const { password_hash, ...safeUser } = user;
    
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const userData = await request.json();
    
    // Check if user exists
    const existingUser = userModel.getUserById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check for username conflicts if username is being updated
    if (userData.username && userData.username !== existingUser.username) {
      const usernameExists = userModel.getUserByUsername(userData.username);
      if (usernameExists) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }
    
    // Check for email conflicts if email is being updated
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = userModel.getUserByEmail(userData.email);
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        );
      }
    }
    
    const updatedUser = await userModel.updateUser(userId, userData);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    // Remove password hash from response
    const { password_hash, ...safeUser } = updatedUser;
    
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const success = userModel.deleteUser(userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}