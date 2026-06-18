import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // In Next.js 15/16, params is a Promise and must be awaited
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  
  const serverUrl = process.env.SERVER_URL || 'https://ajkerkhela-server.vercel.app';
  const url = new URL(request.url);
  const searchParams = url.search;

  try {
    const targetUrl = `${serverUrl}/${path}${searchParams}`;
    const res = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error from backend: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
