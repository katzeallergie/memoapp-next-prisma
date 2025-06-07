import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { title, amount, type, category, description, date } =
    await request.json();

  await prisma.transactions.create({
    data: {
      title,
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    },
  });

  const transactions = await getAllTransactions();
  return NextResponse.json(transactions);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const transaction = await prisma.transactions.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ...transaction,
    date: transaction.date.toISOString().split('T')[0],
  });
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await prisma.transactions.delete({
    where: {
      id: parseInt(id),
    },
  });

  const transactions = await getAllTransactions();
  return NextResponse.json(transactions);
}

// メモAPIと同じパターンの共通関数
async function getAllTransactions() {
  const transactions = await prisma.transactions.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  const formattedTransactions = transactions.map((transaction) => ({
    ...transaction,
    key: transaction.id.toString(),
    date: transaction.date.toISOString().split('T')[0],
  }));

  return formattedTransactions;
}
