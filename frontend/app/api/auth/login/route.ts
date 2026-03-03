import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  
  // 模拟验证 - 实际应用中应该查询数据库
  if (email === 'admin@cyberpress.dev' && password === 'password') {
    const token = Buffer.from(JSON.stringify({ id: '1', email, role: 'admin' })).toString('base64');
    
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: '1',
        name: 'Admin',
        email,
        role: 'admin',
        capabilities: ['manage_options', 'manage_posts'],
      },
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
  }
  
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
