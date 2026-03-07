import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing URL', { status: 400 });
    }

    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'Referer': 'https://www.gramedia.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });

        // Check if the response is actually an image
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
            console.error('Proxy failed: Not an image', contentType);
            return NextResponse.redirect(new URL('/images/LOGO/LOGO GMEI (1).png', request.url));
        }

        return new NextResponse(response.data, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.redirect(new URL('/images/LOGO/LOGO GMEI (1).png', request.url));
    }
}
