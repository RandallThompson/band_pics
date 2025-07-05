import { NextRequest, NextResponse } from 'next/server';
import { PostModel } from '@/lib/database';
import { getRecentEventPosts } from '@/lib/social-media/client';

const postModel = new PostModel();

// List of event hashtags to monitor
// In a real application, these would likely be fetched from a database
const EVENT_HASHTAGS: Record<string, string[]> = {
  'jazz_festival_2025': ['#jazzfest2025', '#jazzfestival', '#livejazz'],
  'rock_concert_2025': ['#rockconcert2025', '#liverock', '#rockmusic'],
  'pop_showcase_2025': ['#popshowcase2025', '#popmusic', '#livepop']
};

/**
 * Convert a social media post to the format expected by our database
 */
function convertToDbPost(post: any, eventId: string) {
  return {
    user_id: null, // Social media posts don't have a user in our system
    title: `${post.platform} post for ${eventId}`,
    content: post.content,
    image_url: post.imageUrl,
    platform: post.platform,
    external_post_url: post.externalUrl,
    tags: post.tags,
    is_featured: false,
    is_public: true
  };
}

/**
 * GET handler for the cron job
 * This will be called by Vercel's cron scheduler once per day at midnight
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    // In production, you might want to add authorization
    const authHeader = request.headers.get('authorization');
    
    // For added security in production, validate a secret token
    // if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    console.log('Starting social media aggregation cron job');
    
    let totalNewPosts = 0;
    const results: Record<string, number> = {};
    
    // Process each event's hashtags
    for (const [eventId, hashtags] of Object.entries(EVENT_HASHTAGS)) {
      console.log(`Processing event: ${eventId} with hashtags: ${hashtags.join(', ')}`);
      
      // Get the most recent posts for this event
      // In a real implementation, you would track the last fetch time
      // and only request posts newer than that timestamp
      const posts = await getRecentEventPosts(hashtags);
      
      // Store new posts in the database
      let newPostsCount = 0;
      for (const post of posts) {
        try {
          const dbPost = convertToDbPost(post, eventId);
          postModel.createPost(dbPost);
          newPostsCount++;
        } catch (error) {
          console.error(`Error storing post from ${post.platform}:`, error);
        }
      }
      
      results[eventId] = newPostsCount;
      totalNewPosts += newPostsCount;
      
      console.log(`Added ${newPostsCount} new posts for event: ${eventId}`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Social media aggregation complete. Added ${totalNewPosts} new posts.`,
      results
    });
  } catch (error) {
    console.error('Error in social media aggregation cron job:', error);
    return NextResponse.json(
      { error: 'Failed to process social media aggregation' },
      { status: 500 }
    );
  }
}