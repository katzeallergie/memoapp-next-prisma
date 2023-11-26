import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getAllMemos } from '../../memos/route';

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
