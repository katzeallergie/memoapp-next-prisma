import { ChangeEvent, useEffect, useState } from 'react';
import { MemoType } from '../types/memo';

export function useMemo() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dataSource, setDataSource] = useState<MemoType[]>([]);
  const [currentId, setCurrentId] = useState(0);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

  useEffect(() => {
    const fetchMemos = async () => {
      const response = await fetch('/api/memos');
      const memos = await response.json();
      setDataSource(memos);
    };
    fetchMemos();
  }, []);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleCreateClick = async () => {
    if (content === '' || title === '') {
      return;
    }
    const response = await fetch('/api/memo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    const memos = await response.json();
    setDataSource(memos);
    setTitle('');
    setContent('');
  };

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`/api/memo?id=${id}`, {
      method: 'DELETE',
    });

    const memos = await response.json();
    setDataSource(memos);
  };

  const handleEditClick = async (id: number) => {
    const response = await fetch(`/api/memo?id=${id}`, {
      method: 'GET',
    });
    const memo = await response.json();

    setTitle(memo.title);
    setContent(memo.content);
    setCurrentId(id);
    setIsOpenUpdateModal(true);
  };

  const handleUpdateClick = async (id: number) => {
    if (content === '' || title === '') {
      return;
    }

    const response = await fetch('/api/memo/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, title, content }),
    });

    const memos = await response.json();
    setDataSource(memos);
    setTitle('');
    setContent('');
  };

  const onOpenCreateModal = () => setIsOpenCreateModal(true);
  const onOpenChangeCreateModal = () =>
    setIsOpenCreateModal(!isOpenCreateModal);
  const onOpenChangeUpdateModal = () =>
    setIsOpenUpdateModal(!isOpenUpdateModal);

  const reset = () => {
    setTitle('');
    setContent('');
  };

  return {
    title,
    content,
    dataSource,
    currentId,
    isOpenCreateModal,
    isOpenUpdateModal,
    handleTitleChange,
    handleContentChange,
    handleCreateClick,
    handleDeleteClick,
    handleEditClick,
    handleUpdateClick,
    onOpenCreateModal,
    onOpenChangeCreateModal,
    onOpenChangeUpdateModal,
    reset,
  };
}
