import { NextRequest, NextResponse } from 'next/server';
import { listEmailsByFolder } from '@/lib/integrations/gmail';

export async function GET(request: NextRequest) {
  try {
    // Test fetching emails from different folders
    const results = await Promise.allSettled([
      listEmailsByFolder('inbox', 5),
      listEmailsByFolder('sent', 5),
      listEmailsByFolder('drafts', 5),
      listEmailsByFolder('spam', 5),
      listEmailsByFolder('trash', 5),
    ]);

    const folderResults = results.map((result, index) => {
      const folders = ['inbox', 'sent', 'drafts', 'spam', 'trash'];
      if (result.status === 'fulfilled') {
        return {
          folder: folders[index],
          success: true,
          count: result.value.messages.length,
          unreadCount: result.value.messages.filter(m => !m.isRead).length,
          messages: result.value.messages.map(m => ({
            id: m.id,
            subject: m.subject,
            from: m.from,
            snippet: m.snippet,
            isRead: m.isRead,
            isStarred: m.isStarred,
          }))
        };
      } else {
        return {
          folder: folders[index],
          success: false,
          error: result.reason?.message || 'Unknown error',
          count: 0,
          unreadCount: 0,
          messages: []
        };
      }
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      folderResults,
      summary: {
        totalEmails: folderResults.reduce((sum, f) => sum + f.count, 0),
        totalUnread: folderResults.reduce((sum, f) => sum + f.unreadCount, 0),
        workingFolders: folderResults.filter(f => f.success).length,
        totalFolders: folderResults.length
      }
    });
  } catch (error: any) {
    console.error('Gmail test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to test Gmail integration',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
