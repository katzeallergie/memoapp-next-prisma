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
  FiPlus,
  FiFilter,
  FiList,
  FiEye,
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
    setCurrentId(0);
  };

  // Modal states
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Filter and sort states
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');

  const onOpenCreateModal = () => setIsOpenCreateModal(true);
  const onOpenUpdateModal = () => setIsOpenUpdateModal(true);
  const onOpenDeleteModal = () => setIsOpenDeleteModal(true);
  const onOpenChangeCreateModal = () =>
    setIsOpenCreateModal(!isOpenCreateModal);
  const onOpenChangeUpdateModal = () =>
    setIsOpenUpdateModal(!isOpenUpdateModal);
  const onOpenChangeDeleteModal = () =>
    setIsOpenDeleteModal(!isOpenDeleteModal);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const getFilteredAndSortedTransactions = () => {
    let filtered = transactions;

    // Filter
    if (filterType === 'income') {
      filtered = filtered.filter(
        (t) => t.type === 'income' || t.type === '収入',
      );
    } else if (filterType === 'expense') {
      filtered = filtered.filter(
        (t) => t.type === 'expense' || t.type === '支出',
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income' || t.type === '収入')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' || t.type === '支出')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpense;

  const filteredTransactions = getFilteredAndSortedTransactions();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
        {/* ナビゲーション */}
        {/* <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50">
            <Button
              as="a"
              href="/"
              color="default"
              variant="light"
              size="sm"
              className="px-6 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              startContent={<FiFileText className="text-base" />}
            >
              メモ
            </Button>
            <Button
              as="a"
              href="/transactions"
              color="primary"
              variant="solid"
              size="sm"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all duration-200"
              startContent={<FiBarChart className="text-base" />}
            >
              収支表
            </Button>
          </div>
        </div> */}

        {/* タイトル */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl shadow-lg">
                <FiDollarSign className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  浦上 副業収支表
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* サマリーカード - 履歴表示モードでは非表示 */}
        {viewMode === 'edit' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 収入カード */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-0 shadow-lg backdrop-blur-xl">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                      総収入
                    </p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      ¥{formatAmount(totalIncome)}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <FiTrendingUp className="text-white text-lg" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 支出カード */}
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-0 shadow-lg backdrop-blur-xl">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">
                      総支出
                    </p>
                    <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                      ¥{formatAmount(totalExpense)}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                    <FiTrendingDown className="text-white text-lg" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 純収益カード */}
            <Card
              className={`bg-gradient-to-br ${
                netAmount >= 0
                  ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                  : 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
              } border-0 shadow-lg backdrop-blur-xl`}
            >
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        netAmount >= 0
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      純収益
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        netAmount >= 0
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      ¥{formatAmount(netAmount)}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl shadow-lg ${
                      netAmount >= 0
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-br from-amber-500 to-orange-600'
                    }`}
                  >
                    <FiBarChart className="text-white text-lg" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* コントロールパネル */}
        <Card className="mb-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader
            className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-200 p-3"
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <FiSettings className="text-white text-xs" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                    フィルター・ソート設定
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="text-xs font-medium"
                >
                  {filteredTransactions.length}件
                </Chip>
                {isControlsExpanded ? (
                  <FiChevronDown className="text-slate-400 text-base" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-base" />
                )}
              </div>
            </div>
          </CardHeader>

          {isControlsExpanded && (
            <CardBody className="p-3 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Select
                  label="表示フィルター"
                  placeholder="タイプを選択"
                  selectedKeys={[filterType]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) setFilterType(selected);
                  }}
                  size="sm"
                  variant="bordered"
                  startContent={<FiFilter className="text-xs" />}
                  className="max-w-full"
                  classNames={{
                    trigger: 'h-10',
                    label: 'text-xs',
                  }}
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
                  label="ソート項目"
                  placeholder="項目を選択"
                  selectedKeys={[sortBy]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) setSortBy(selected);
                  }}
                  size="sm"
                  variant="bordered"
                  startContent={<FiBarChart className="text-sm" />}
                  className="max-w-full"
                  classNames={{
                    trigger: 'h-10',
                    label: 'text-xs',
                  }}
                >
                  <SelectItem key="date" value="date">
                    日付順
                  </SelectItem>
                  <SelectItem key="amount" value="amount">
                    金額順
                  </SelectItem>
                </Select>

                <Select
                  label="ソート順"
                  placeholder="順序を選択"
                  selectedKeys={[sortOrder]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) setSortOrder(selected);
                  }}
                  size="sm"
                  variant="bordered"
                  startContent={
                    sortOrder === 'desc' ? (
                      <FiArrowDown className="text-sm" />
                    ) : (
                      <FiArrowUp className="text-sm" />
                    )
                  }
                  className="max-w-full"
                  classNames={{
                    trigger: 'h-10',
                    label: 'text-xs',
                  }}
                >
                  <SelectItem key="desc" value="desc">
                    降順
                  </SelectItem>
                  <SelectItem key="asc" value="asc">
                    昇順
                  </SelectItem>
                </Select>
              </div>
            </CardBody>
          )}
        </Card>

        {/* 新規作成ボタンと表示切り替え */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* 表示切り替えボタン */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              color={viewMode === 'edit' ? 'primary' : 'default'}
              variant={viewMode === 'edit' ? 'solid' : 'bordered'}
              size="lg"
              onPress={() => setViewMode('edit')}
              className="transition-all duration-200 flex-1 sm:flex-none px-6"
              startContent={<FiList className="text-lg" />}
            >
              編集可能
            </Button>
            <Button
              color={viewMode === 'view' ? 'primary' : 'default'}
              variant={viewMode === 'view' ? 'solid' : 'bordered'}
              size="lg"
              onPress={() => setViewMode('view')}
              className="transition-all duration-200 flex-1 sm:flex-none px-6"
              startContent={<FiEye className="text-lg" />}
            >
              履歴表示
            </Button>
          </div>

          {/* 新規作成ボタン - 編集モードのみ */}
          {viewMode === 'edit' && (
            <Button
              onPress={onOpenCreateModal}
              color="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8 w-full sm:w-auto"
              startContent={<FiPlus className="text-lg" />}
            >
              収支を追加
            </Button>
          )}
        </div>

        {/* PC用テーブル表示 */}
        <div className="hidden md:block">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl">
            <CardBody className="p-0">
              <Table
                aria-label="収支一覧テーブル"
                className="min-h-[400px]"
                classNames={{
                  wrapper: 'shadow-none bg-transparent',
                  th: 'bg-slate-50/80 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold',
                  td: `${
                    viewMode === 'view' ? 'py-1' : 'py-4'
                  } border-b border-slate-100 dark:border-slate-700/50`,
                }}
              >
                <TableHeader>
                  <TableColumn>日付</TableColumn>
                  <TableColumn>タイトル</TableColumn>
                  <TableColumn className={viewMode === 'view' ? 'hidden' : ''}>
                    カテゴリ
                  </TableColumn>
                  <TableColumn className={viewMode === 'view' ? 'hidden' : ''}>
                    タイプ
                  </TableColumn>
                  <TableColumn>金額</TableColumn>
                  <TableColumn className={viewMode === 'view' ? 'hidden' : ''}>
                    操作
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.key}>
                      <TableCell>
                        <span
                          className={`${
                            viewMode === 'view'
                              ? 'text-xs text-slate-500 dark:text-slate-400'
                              : 'font-medium text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {viewMode === 'view'
                            ? formatDate(transaction.date).replace(/\//g, '/')
                            : formatDate(transaction.date)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          {viewMode === 'view' && (
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                transaction.type === 'income' ||
                                transaction.type === '収入'
                                  ? 'bg-emerald-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                          )}
                          <span
                            className={`${
                              viewMode === 'view'
                                ? 'text-sm max-w-xs'
                                : 'font-medium max-w-sm'
                            } text-slate-800 dark:text-white truncate`}
                            title={transaction.title}
                          >
                            {transaction.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={viewMode === 'view' ? 'hidden' : ''}
                      >
                        <Chip
                          size="sm"
                          variant="flat"
                          color="default"
                          className="text-xs"
                        >
                          {transaction.category || 'なし'}
                        </Chip>
                      </TableCell>
                      <TableCell
                        className={viewMode === 'view' ? 'hidden' : ''}
                      >
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            transaction.type === 'income' ||
                            transaction.type === '収入'
                              ? 'success'
                              : 'danger'
                          }
                          startContent={
                            transaction.type === 'income' ||
                            transaction.type === '収入' ? (
                              <FiTrendingUp className="text-xs" />
                            ) : (
                              <FiTrendingDown className="text-xs" />
                            )
                          }
                        >
                          {transaction.type === 'income' ||
                          transaction.type === '収入'
                            ? '収入'
                            : '支出'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            viewMode === 'view' ? 'text-sm' : 'text-lg'
                          } ${
                            transaction.type === 'income' ||
                            transaction.type === '収入'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {transaction.type === 'income' ||
                          transaction.type === '収入'
                            ? '+'
                            : '-'}
                          ¥{formatAmount(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell
                        className={viewMode === 'view' ? 'hidden' : ''}
                      >
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={() => handleEditClick(transaction.id)}
                            className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            編集
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={() => handleDeleteClick(transaction.id)}
                            className="hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            削除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        {/* スマホ用カード表示 */}
        <div
          className={`md:hidden ${
            viewMode === 'view' ? 'space-y-1' : 'space-y-4'
          }`}
        >
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.key}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <CardBody className={viewMode === 'view' ? 'px-3 py-2' : 'p-4'}>
                {viewMode === 'view' ? (
                  // 履歴表示：1行コンパクト表示
                  <div className="flex items-center w-full min-w-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          transaction.type === 'income' ||
                          transaction.type === '収入'
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span
                        className="text-sm text-slate-800 dark:text-white truncate max-w-[140px]"
                        title={transaction.title}
                      >
                        {transaction.title}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-auto">
                        {formatDate(transaction.date).replace(
                          /(\d{4})\/(\d{2})\/(\d{2})/,
                          '$2/$3',
                        )}
                      </span>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span
                        className={`font-bold text-sm whitespace-nowrap ${
                          transaction.type === 'income' ||
                          transaction.type === '収入'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {transaction.type === 'income' ||
                        transaction.type === '収入'
                          ? '+'
                          : '-'}
                        ¥{formatAmount(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  // 編集表示：詳細表示
                  <>
                    <div className="flex items-start justify-between mb-3 w-full min-w-0">
                      <div className="flex-1 min-w-0 max-w-[60%]">
                        <h3
                          className="font-semibold text-slate-800 dark:text-white text-base mb-1 truncate"
                          title={transaction.title}
                        >
                          {transaction.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <FiCalendar className="text-xs flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div
                          className={`text-xl font-bold whitespace-nowrap ${
                            transaction.type === 'income' ||
                            transaction.type === '収入'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {transaction.type === 'income' ||
                          transaction.type === '収入'
                            ? '+'
                            : '-'}
                          ¥{formatAmount(transaction.amount)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            transaction.type === 'income' ||
                            transaction.type === '収入'
                              ? 'success'
                              : 'danger'
                          }
                          startContent={
                            transaction.type === 'income' ||
                            transaction.type === '収入' ? (
                              <FiTrendingUp className="text-xs" />
                            ) : (
                              <FiTrendingDown className="text-xs" />
                            )
                          }
                          className="text-xs"
                        >
                          {transaction.type === 'income' ||
                          transaction.type === '収入'
                            ? '収入'
                            : '支出'}
                        </Chip>
                        {transaction.category && (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="default"
                            className="text-xs"
                          >
                            {transaction.category}
                          </Chip>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => handleEditClick(transaction.id)}
                          className="min-w-0 px-3 text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                          編集
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={() => handleDeleteClick(transaction.id)}
                          className="min-w-0 px-3 text-xs hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          削除
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* データがない場合の表示 */}
        {filteredTransactions.length === 0 && (
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl">
            <CardBody className="p-12 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <FiBarChart className="text-slate-500 dark:text-slate-400 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                データがありません
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {viewMode === 'edit'
                  ? '新しい収支を追加してください'
                  : '条件に一致するデータがありません'}
              </p>
              {viewMode === 'edit' && (
                <Button
                  onPress={onOpenCreateModal}
                  color="primary"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  startContent={<FiPlus />}
                >
                  最初の収支を追加
                </Button>
              )}
            </CardBody>
          </Card>
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
                <ModalHeader>収支を追加</ModalHeader>
                <ModalBody className="overflow-y-auto">
                  <Input
                    label="タイトル"
                    value={title}
                    onChange={handleTitleChange}
                    classNames={{
                      input: 'text-base',
                    }}
                  />
                  <Input
                    label="金額"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
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
                    onChange={handleDateChange}
                    classNames={{
                      input: 'text-base',
                    }}
                  />
                  <Textarea
                    label="説明"
                    value={description}
                    onChange={handleDescriptionChange}
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
                <ModalHeader>収支を編集</ModalHeader>
                <ModalBody className="overflow-y-auto">
                  <Input
                    label="タイトル"
                    value={title}
                    onChange={handleTitleChange}
                    classNames={{
                      input: 'text-base',
                    }}
                  />
                  <Input
                    label="金額"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
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
                    onChange={handleDateChange}
                    classNames={{
                      input: 'text-base',
                    }}
                  />
                  <Textarea
                    label="説明"
                    value={description}
                    onChange={handleDescriptionChange}
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
      </div>
    </div>
  );
}
