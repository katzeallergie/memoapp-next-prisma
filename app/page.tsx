'use client';

import { Button } from '@nextui-org/react';
import Navigation from './components/Navigation';
import MemoModal from './components/MemoModal';
import MemoList from './components/MemoList';
import { useMemo } from './hooks/useMemo';

export default function Home() {
  const {
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
  } = useMemo();

  return (
    <div className="h-screen p-8 overflow-y-auto">
      <h1 className="text-xl text-center mb-6">クソ雑MemoApp</h1>

      <Navigation />

      <div className="w-full mb-6 flex justify-end">
        <Button onPress={onOpenCreateModal} color="primary">
          メモを追加
        </Button>
      </div>

      <MemoModal
        isOpen={isOpenCreateModal}
        onOpenChange={onOpenChangeCreateModal}
        title={title}
        content={content}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onSubmit={handleCreateClick}
        isEdit={false}
      />

      <MemoModal
        isOpen={isOpenUpdateModal}
        onOpenChange={onOpenChangeUpdateModal}
        title={title}
        content={content}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onSubmit={() => handleUpdateClick(currentId)}
        isEdit={true}
      />

      <MemoList
        memos={dataSource}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}
