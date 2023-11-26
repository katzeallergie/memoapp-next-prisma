import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

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

async function getAllMemos() {
  const memos = await prisma.memos.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return memos;
}
