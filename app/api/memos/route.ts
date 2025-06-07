import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const memos = await getAllMemos();
  return NextResponse.json(memos);
}

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();

  await prisma.memos.create({
    data: {
      title: title,
      content: content,
    },
  });

  const memos = await getAllMemos();
  return NextResponse.json(memos);
}

async function getAllMemos() {
  const memos = await prisma.memos.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return memos;
}
