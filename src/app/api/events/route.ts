import { NextRequest, NextResponse } from 'next/server';
import { EventModel } from '@/lib/database';

const eventModel = new EventModel();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const events = eventModel.getEvents(limit, offset);
    return NextResponse.json({ events, limit, offset });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
