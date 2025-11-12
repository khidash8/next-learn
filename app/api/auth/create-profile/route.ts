import { NextRequest, NextResponse } from 'next/server';

const REMOTE_API = 'https://nexlearn.noviindusdemosites.in';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${REMOTE_API}/auth/create-profile`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create profile' },
      { status: 500 },
    );
  }
}
