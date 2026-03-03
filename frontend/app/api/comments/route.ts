import { NextRequest, NextResponse } from 'next/server';

interface Comment {
  id: string;
  post_id: number;
  parent_id?: string;
  author_name: string;
  author_email: string;
  content: string;
  date: string;
  status: 'approved' | 'pending';
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

const comments: Comment[] = [];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('post_id');
  
  let filteredComments = comments.filter(c => c.status === 'approved');
  
  if (postId) {
    filteredComments = filteredComments.filter(c => c.post_id === parseInt(postId));
  }
  
  return NextResponse.json(filteredComments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { post_id, parent_id, author_name, author_email, content } = body;
  
  if (!post_id || !author_name || !author_email || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const newComment: Comment = {
    id: Date.now().toString(),
    post_id: parseInt(post_id),
    parent_id,
    author_name,
    author_email,
    content,
    date: new Date().toISOString(),
    status: 'pending',
    likes: 0,
    dislikes: 0,
  };
  
  comments.push(newComment);
  
  return NextResponse.json(newComment, { status: 201 });
}
