import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseM3U } from '@/lib/m3uParser';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'playlist.m3u');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Playlist file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const channels = parseM3U(fileContent);

    return NextResponse.json(channels);
  } catch (error) {
    console.error('API Error parsing playlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
