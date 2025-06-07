import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    );
  }
}
