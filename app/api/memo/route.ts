import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getAllMemos } from '../memos/route';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  const id = parseInt(request.nextUrl.searchParams.get('id')!);

  await prisma.memos.delete({
    where: {
      id: id,
    },
  });

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

export async function GET(request: NextRequest) {
  const id = parseInt(request.nextUrl.searchParams.get('id')!);

  const memo = await prisma.memos.findFirst({
    where: {
      id: id,
    },
  });
  return NextResponse.json(memo);
}
