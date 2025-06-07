'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
  FiSettings,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart,
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
    setDeleteTargetId(id);
    onOpenDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;

    try {
      const response = await fetch(`/api/transaction?id=${deleteTargetId}`, {
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
    } finally {
      setDeleteTargetId(null);
      setIsOpenDeleteModal(false);
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
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const onOpenCreateModal = () => setIsOpenCreateModal(true);
  const onOpenUpdateModal = () => setIsOpenUpdateModal(true);
  const onOpenDeleteModal = () => setIsOpenDeleteModal(true);
  const onOpenChangeCreateModal = () =>
    setIsOpenCreateModal(!isOpenCreateModal);
  const onOpenChangeUpdateModal = () =>
    setIsOpenUpdateModal(!isOpenUpdateModal);
  const onOpenChangeDeleteModal = () =>
    setIsOpenDeleteModal(!isOpenDeleteModal);

  // 収支の計算
  const totalIncome = (transactions || [])
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = (transactions || [])
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // フィルタリングとソート
  const getFilteredAndSortedTransactions = () => {
    let filtered = transactions || [];

    // フィルタリング
    if (filter === 'income') {
      filtered = filtered.filter((t) => t.type === 'income');
    } else if (filter === 'expense') {
      filtered = filtered.filter((t) => t.type === 'expense');
    }

    // ソート
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const comparison =
          new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        // amount
        const comparison = a.amount - b.amount;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  };

  const filteredAndSortedTransactions = getFilteredAndSortedTransactions();

  return (
    <div className="h-screen p-8 overflow-y-auto">
      <h1 className="text-xl text-center mb-6 text-gray-900 dark:text-gray-100">
        浦上 副業収支表
      </h1>

      <div className="w-full mb-6 flex gap-2">
        <Button
          onPress={() => setIsTableView(!isTableView)}
          color="primary"
          variant="ghost"
        >
          {isTableView ? 'カード表示' : '履歴表示'}
        </Button>
        <Button
          onPress={onOpenCreateModal}
          color="primary"
          className="ml-auto mr-0"
        >
          取引を追加
        </Button>
      </div>

      {/* 収支サマリー - カード表示時のみ */}
      {!isTableView && (
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
      )}

      {/* 作成モーダル */}
      <Modal
        isOpen={isOpenCreateModal}
        placement="center"
        onOpenChange={onOpenChangeCreateModal}
        className="m-4"
        scrollBehavior="inside"
        size="lg"
      >
        <ModalContent className="max-h-[80vh]">
          {(onClose) => (
            <>
              <ModalHeader>取引を追加</ModalHeader>
              <ModalBody className="overflow-y-auto">
                <Input
                  label="タイトル"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  classNames={{
                    input: 'text-base',
                  }}
                />
                <Input
                  label="金額"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  classNames={{
                    input: 'text-base',
                  }}
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
                  classNames={{
                    input: 'text-base',
                  }}
                />
                <Textarea
                  label="説明"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  classNames={{
                    input: 'text-base',
                  }}
                />
              </ModalBody>
              <ModalFooter className="flex-shrink-0">
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
        scrollBehavior="inside"
        size="lg"
      >
        <ModalContent className="max-h-[80vh]">
          {(onClose) => (
            <>
              <ModalHeader>取引を編集</ModalHeader>
              <ModalBody className="overflow-y-auto">
                <Input
                  label="タイトル"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  classNames={{
                    input: 'text-base',
                  }}
                />
                <Input
                  label="金額"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  classNames={{
                    input: 'text-base',
                  }}
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
                  classNames={{
                    input: 'text-base',
                  }}
                />
                <Textarea
                  label="説明"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  classNames={{
                    input: 'text-base',
                  }}
                />
              </ModalBody>
              <ModalFooter className="flex-shrink-0">
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

      {/* 削除確認モーダル */}
      <Modal
        isOpen={isOpenDeleteModal}
        placement="center"
        onOpenChange={onOpenChangeDeleteModal}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-center">削除の確認</ModalHeader>
              <ModalBody className="text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  この取引を削除しますか？
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  この操作は取り消すことができません。
                </p>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button
                  color="default"
                  variant="light"
                  onPress={() => setIsOpenDeleteModal(false)}
                >
                  キャンセル
                </Button>
                <Button color="danger" onPress={handleConfirmDelete}>
                  削除する
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 取引リスト */}
      <div className="mt-4 pb-4">
        {isTableView ? (
          /* 履歴表示 */
          <div>
            {/* フィルター・ソートコントロール */}
            <div className="mb-4">
              {/* ヘッダー部分（常に表示） */}
              <div
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                {/* PC・タブレット表示 */}
                <div className="hidden sm:flex items-center gap-4">
                  <FiSettings className="text-lg text-gray-600 dark:text-gray-400" />
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      {filter === 'all' ? (
                        <FiBarChart className="text-blue-500" />
                      ) : filter === 'income' ? (
                        <FiTrendingUp className="text-green-500" />
                      ) : (
                        <FiTrendingDown className="text-red-500" />
                      )}
                      <span className="text-gray-600 dark:text-gray-400">
                        {filter === 'all'
                          ? '全て'
                          : filter === 'income'
                          ? '収入'
                          : '支出'}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      {sortBy === 'date' ? (
                        <FiCalendar className="text-gray-500" />
                      ) : (
                        <FiDollarSign className="text-gray-500" />
                      )}
                      <span className="text-gray-600 dark:text-gray-400">
                        {sortBy === 'date' ? '日付' : '金額'}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      {sortOrder === 'desc' ? (
                        <FiArrowDown className="text-gray-500" />
                      ) : (
                        <FiArrowUp className="text-gray-500" />
                      )}
                      <span className="text-gray-600 dark:text-gray-400">
                        {sortOrder === 'desc' ? '新→古' : '古→新'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* スマホ表示 */}
                <div className="sm:hidden flex items-center gap-3">
                  <FiSettings className="text-lg text-gray-600 dark:text-gray-400" />
                  <div className="flex items-center gap-2">
                    {filter === 'all' ? (
                      <FiBarChart className="text-blue-500" />
                    ) : filter === 'income' ? (
                      <FiTrendingUp className="text-green-500" />
                    ) : (
                      <FiTrendingDown className="text-red-500" />
                    )}
                    {sortBy === 'date' ? (
                      <FiCalendar className="text-gray-500" />
                    ) : (
                      <FiDollarSign className="text-gray-500" />
                    )}
                    {sortOrder === 'desc' ? (
                      <FiArrowDown className="text-gray-500" />
                    ) : (
                      <FiArrowUp className="text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <FiFileText className="text-sm" />
                    <span>{filteredAndSortedTransactions.length}</span>
                  </div>
                  {isFilterExpanded ? (
                    <FiChevronDown className="text-gray-500 dark:text-gray-400" />
                  ) : (
                    <FiChevronRight className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>

              {/* 展開部分（条件付き表示） */}
              {isFilterExpanded && (
                <div className="mt-2 flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Select
                    label="表示"
                    selectedKeys={[filter]}
                    onSelectionChange={(keys) => {
                      const newValue = Array.from(keys)[0] as
                        | 'all'
                        | 'income'
                        | 'expense';
                      if (newValue && newValue !== filter) {
                        setFilter(newValue);
                      }
                    }}
                    className="min-w-0 sm:w-32"
                    size="sm"
                  >
                    <SelectItem key="all" value="all">
                      全て
                    </SelectItem>
                    <SelectItem key="income" value="income">
                      収入のみ
                    </SelectItem>
                    <SelectItem key="expense" value="expense">
                      支出のみ
                    </SelectItem>
                  </Select>

                  <Select
                    label="並び順"
                    selectedKeys={[sortBy]}
                    onSelectionChange={(keys) => {
                      const newValue = Array.from(keys)[0] as 'date' | 'amount';
                      if (newValue && newValue !== sortBy) {
                        setSortBy(newValue);
                      }
                    }}
                    className="min-w-0 sm:w-32"
                    size="sm"
                  >
                    <SelectItem key="date" value="date">
                      日付順
                    </SelectItem>
                    <SelectItem key="amount" value="amount">
                      金額順
                    </SelectItem>
                  </Select>

                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() =>
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                    className="min-w-0 sm:w-24"
                  >
                    {sortOrder === 'desc' ? '↓ 降順' : '↑ 昇順'}
                  </Button>
                </div>
              )}
            </div>
            {/* PC・タブレット用テーブル表示 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-2 py-1 text-left text-gray-600 dark:text-gray-300">
                      日付
                    </th>
                    <th className="px-2 py-1 text-left text-gray-600 dark:text-gray-300">
                      タイトル
                    </th>
                    <th className="px-2 py-1 text-left text-gray-600 dark:text-gray-300">
                      カテゴリ
                    </th>
                    <th className="px-2 py-1 text-center text-gray-600 dark:text-gray-300">
                      種類
                    </th>
                    <th className="px-2 py-1 text-right text-gray-600 dark:text-gray-300">
                      金額
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedTransactions.map((transaction) => (
                    <tr
                      key={transaction.key}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-2 py-1 text-gray-500 dark:text-gray-400">
                        {transaction.date}
                      </td>
                      <td className="px-2 py-1 text-gray-900 dark:text-gray-100 font-medium">
                        <div
                          className="truncate max-w-xs"
                          title={transaction.title}
                        >
                          {transaction.title}
                        </div>
                      </td>
                      <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                        {transaction.category
                          ? categories.find(
                              (c) => c.key === transaction.category,
                            )?.label || '-'
                          : '-'}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {transaction.type === 'income' ? (
                          <FiTrendingUp
                            className="text-green-500 mx-auto"
                            title="収入"
                          />
                        ) : (
                          <FiTrendingDown
                            className="text-red-500 mx-auto"
                            title="支出"
                          />
                        )}
                      </td>
                      <td className="px-2 py-1 text-right font-bold">
                        <span
                          className={`${
                            transaction.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}¥
                          {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* スマホ用コンパクトリスト表示 */}
            <div className="md:hidden space-y-1">
              {filteredAndSortedTransactions.map((transaction) => (
                <div
                  key={transaction.key}
                  className="bg-white dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {transaction.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{transaction.date}</span>
                        {transaction.type === 'income' ? (
                          <FiTrendingUp className="text-green-500 w-3 h-3" />
                        ) : (
                          <FiTrendingDown className="text-red-500 w-3 h-3" />
                        )}
                        {transaction.category && (
                          <span>
                            {
                              categories.find(
                                (c) => c.key === transaction.category,
                              )?.label
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold text-sm ${
                          transaction.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}¥
                        {transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* カード表示 */
          <>
            {(transactions || []).map((transaction) => (
              <Card key={transaction.key} className="mb-4">
                <CardHeader className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{transaction.title}</h3>
                    <Chip
                      color={
                        transaction.type === 'income' ? 'success' : 'danger'
                      }
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
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}¥
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  {transaction.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      カテゴリ:{' '}
                      {
                        categories.find((c) => c.key === transaction.category)
                          ?.label
                      }
                    </p>
                  )}
                  {transaction.description && (
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {transaction.description}
                    </p>
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
          </>
        )}
      </div>
    </div>
  );
}
