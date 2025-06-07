import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// キャッシュを無効化
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const transactions = await getAllTransactions();
  return NextResponse.json(transactions);
}

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
