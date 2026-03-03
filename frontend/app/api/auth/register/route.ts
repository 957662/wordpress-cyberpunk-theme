import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;
  
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  
  const token = Buffer.from(JSON.stringify({ id: Date.now().toString(), email, role: 'subscriber' })).toString('base64');
  
  const response = NextResponse.json({
    success: true,
    token,
    user: {
      id: Date.now().toString(),
      name,
      email,
      role: 'subscriber',
      capabilities: ['read'],
    },
  }, { status: 201 });
  
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  
  return response;
}
