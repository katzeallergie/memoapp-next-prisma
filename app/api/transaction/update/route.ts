import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id, title, amount, type, category, description, date } =
      await request.json();

    await prisma.transactions.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: date ? new Date(date) : new Date(),
      },
    });

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
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 },
    );
  }
}
