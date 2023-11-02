import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const memos = await getAllMemos();
  return NextResponse.json(memos);
}

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();

  await prisma.memos.create({
    data: {
      content: content,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const id = parseInt(request.nextUrl.searchParams.get("id")!);

  await prisma.memos.delete({
    where: {
      id: id,
    },
  });

  const memos = await getAllMemos();
  return NextResponse.json(memos);
}

async function getAllMemos() {
  const memos = await prisma.memos.findMany();
  return memos;
}
