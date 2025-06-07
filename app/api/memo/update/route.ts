import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { id, title, content } = await request.json();

  await prisma.memos.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
    },
  });

  const memos = await getAllMemos();
  return NextResponse.json(memos);
}

// TOOD: 共通化したい。apiディレクトリ内でexportするとbuildエラーになる
async function getAllMemos() {
  const memos = await prisma.memos.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return memos;
}
