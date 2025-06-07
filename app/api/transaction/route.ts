import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
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
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
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
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 },
    );
  }
}
