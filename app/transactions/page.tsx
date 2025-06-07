'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  Chip,
} from '@nextui-org/react';

interface TransactionType {
  key: string;
  id: number;
  title: string;
  amount: number;
  type: string;
  category?: string;
  description?: string;
  date: string;
}

export default function TransactionsPage() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [currentId, setCurrentId] = useState(0);

  const categories = [
    { key: 'work', label: '副業収入' },
    { key: 'entertainment', label: '娯楽費' },
    { key: 'transport', label: '交通費' },
    { key: 'food', label: '食費' },
    { key: 'other', label: 'その他' },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    };
    fetchTransactions();
  }, []);

  const handleCreateClick = async () => {
    if (!title || !amount || !type) {
      return;
    }
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          amount,
          type,
          category,
          description,
          date,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
        resetForm();
      } else {
        console.error('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const response = await fetch(`/api/transaction?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const response = await fetch(`/api/transaction?id=${id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const transaction = await response.json();

        setTitle(transaction.title);
        setAmount(transaction.amount.toString());
        setType(transaction.type);
        setCategory(transaction.category || '');
        setDescription(transaction.description || '');
        setDate(transaction.date);
        setCurrentId(id);
        onOpenUpdateModal();
      } else {
        console.error('Failed to fetch transaction');
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
    }
  };

  const handleUpdateClick = async (id: number) => {
    if (!title || !amount || !type) {
      return;
    }

    try {
      const response = await fetch('/api/transaction/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          amount,
          type,
          category,
          description,
          date,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
        resetForm();
      } else {
        console.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

  const onOpenCreateModal = () => setIsOpenCreateModal(true);
  const onOpenUpdateModal = () => setIsOpenUpdateModal(true);
  const onOpenChangeCreateModal = () =>
    setIsOpenCreateModal(!isOpenCreateModal);
  const onOpenChangeUpdateModal = () =>
    setIsOpenUpdateModal(!isOpenUpdateModal);

  // 収支の計算
  const totalIncome = (transactions || [])
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = (transactions || [])
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="h-screen p-8">
      <h1 className="text-xl text-center mb-6">副業収支表</h1>

      {/* ナビゲーション */}
      <div className="w-full mb-6 flex justify-center">
        <div className="flex gap-4 bg-gray-100 p-2 rounded-lg">
          <Button as="a" href="/" color="default" variant="light" size="sm">
            メモ
          </Button>
          <Button
            as="a"
            href="/transactions"
            color="primary"
            variant="solid"
            size="sm"
          >
            収支表
          </Button>
        </div>
      </div>

      {/* 収支サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50">
          <CardBody className="text-center">
            <h3 className="text-lg font-semibold text-green-700">収入</h3>
            <p className="text-2xl font-bold text-green-800">
              ¥{totalIncome.toLocaleString()}
            </p>
          </CardBody>
        </Card>
        <Card className="bg-red-50">
          <CardBody className="text-center">
            <h3 className="text-lg font-semibold text-red-700">支出</h3>
            <p className="text-2xl font-bold text-red-800">
              ¥{totalExpense.toLocaleString()}
            </p>
          </CardBody>
        </Card>
        <Card className={balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}>
          <CardBody className="text-center">
            <h3 className="text-lg font-semibold text-blue-700">収支</h3>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}
            >
              ¥{balance.toLocaleString()}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="w-full mb-6 flex">
        <Button
          onPress={onOpenCreateModal}
          color="primary"
          className="ml-auto mr-0"
        >
          取引を追加
        </Button>
      </div>

      {/* 作成モーダル */}
      <Modal
        isOpen={isOpenCreateModal}
        placement="center"
        onOpenChange={onOpenChangeCreateModal}
        className="m-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>取引を追加</ModalHeader>
              <ModalBody>
                <Input
                  label="タイトル"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  label="金額"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Select
                  label="種類"
                  selectedKeys={type ? [type] : []}
                  onSelectionChange={(keys) =>
                    setType(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="income" value="income">
                    収入
                  </SelectItem>
                  <SelectItem key="expense" value="expense">
                    支出
                  </SelectItem>
                </Select>
                <Select
                  label="カテゴリ"
                  selectedKeys={category ? [category] : []}
                  onSelectionChange={(keys) =>
                    setCategory(Array.from(keys)[0] as string)
                  }
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="日付"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Textarea
                  label="説明"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => setIsOpenCreateModal(false)}
                >
                  閉じる
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleCreateClick();
                    setIsOpenCreateModal(false);
                  }}
                >
                  作成
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 更新モーダル */}
      <Modal
        isOpen={isOpenUpdateModal}
        placement="center"
        onOpenChange={onOpenChangeUpdateModal}
        className="m-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>取引を編集</ModalHeader>
              <ModalBody>
                <Input
                  label="タイトル"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  label="金額"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Select
                  label="種類"
                  selectedKeys={type ? [type] : []}
                  onSelectionChange={(keys) =>
                    setType(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="income" value="income">
                    収入
                  </SelectItem>
                  <SelectItem key="expense" value="expense">
                    支出
                  </SelectItem>
                </Select>
                <Select
                  label="カテゴリ"
                  selectedKeys={category ? [category] : []}
                  onSelectionChange={(keys) =>
                    setCategory(Array.from(keys)[0] as string)
                  }
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="日付"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Textarea
                  label="説明"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => setIsOpenUpdateModal(false)}
                >
                  閉じる
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleUpdateClick(currentId);
                    setIsOpenUpdateModal(false);
                  }}
                >
                  更新
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 取引リスト */}
      <div className="mt-4">
        {(transactions || []).map((transaction) => (
          <Card key={transaction.key} className="mb-4">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{transaction.title}</h3>
                <Chip
                  color={transaction.type === 'income' ? 'success' : 'danger'}
                  variant="flat"
                  size="sm"
                >
                  {transaction.type === 'income' ? '収入' : '支出'}
                </Chip>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}¥
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {transaction.category && (
                <p className="text-sm text-gray-600 mb-2">
                  カテゴリ:{' '}
                  {
                    categories.find((c) => c.key === transaction.category)
                      ?.label
                  }
                </p>
              )}
              {transaction.description && (
                <p className="text-sm">{transaction.description}</p>
              )}
            </CardBody>
            <Divider />
            <CardFooter className="justify-end">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  variant="light"
                  onPress={() => handleEditClick(transaction.id)}
                >
                  編集
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => handleDeleteClick(transaction.id)}
                >
                  削除
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
