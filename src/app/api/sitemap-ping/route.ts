import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Google sitemap ping
    const googlePingUrl = 'https://www.google.com/ping?sitemap=https://aptgugu.com/sitemap.xml';
    
    const response = await fetch(googlePingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'AptGugu-Sitemap-Ping/1.0',
      },
    });

    if (response.ok) {
      console.log('✅ Google sitemap ping successful');
      return NextResponse.json({ 
        success: true, 
        message: 'Google sitemap ping sent successfully',
        status: response.status 
      });
    } else {
      console.log('❌ Google sitemap ping failed:', response.status);
      return NextResponse.json({ 
        success: false, 
        message: 'Google sitemap ping failed',
        status: response.status 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Error sending Google sitemap ping:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error sending Google sitemap ping',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 