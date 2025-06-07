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
  Textarea,
} from '@nextui-org/react';

interface DataType {
  key: string;
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [currentId, setCurrentId] = useState(0);

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
    if (content == '' || title == '') {
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
    onOpenUpdateModal();
  };

  const handleUpdateClick = async (id: number) => {
    if (content == '' || title == '') {
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

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

  const onOpenCreateModal = () => setIsOpenCreateModal(true);
  const onOpenUpdateModal = () => setIsOpenUpdateModal(true);
  const onOpenChangeCreateModal = () =>
    setIsOpenCreateModal(!isOpenCreateModal);
  const onOpenChangeUpdateModal = () =>
    setIsOpenUpdateModal(!isOpenUpdateModal);

  const reset = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="h-screen p-8">
      <h1 className="text-xl text-center mb-6">クソ雑MemoApp</h1>

      {/* ナビゲーション */}
      <div className="w-full mb-6 flex justify-center px-4">
        <div className="flex gap-2 sm:gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 max-w-fit">
          <Button
            as="a"
            href="/"
            color="primary"
            variant="solid"
            size="sm"
            className="dark:bg-blue-600 dark:hover:bg-blue-700 min-w-0 px-3 text-xs sm:text-sm"
          >
            メモ
          </Button>
          <Button
            as="a"
            href="/transactions"
            color="default"
            variant="light"
            size="sm"
            className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 min-w-0 px-3 text-xs sm:text-sm"
          >
            収支表
          </Button>
        </div>
      </div>

      <div className="w-full mb-6 flex justify-end">
        <Button onPress={onOpenCreateModal} color="primary">
          メモを追加
        </Button>
      </div>

      <Modal
        isOpen={isOpenCreateModal}
        placement="center"
        onOpenChange={onOpenChangeCreateModal}
        className="m-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                メモを追加
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  key="default"
                  color="default"
                  value={title}
                  onChange={handleTitleChange}
                ></Input>
                <Textarea
                  label="Content"
                  placeholder="Enter content"
                  className="mt-2"
                  value={content}
                  onChange={handleContentChange}
                ></Textarea>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => setIsOpenCreateModal(false)}
                >
                  閉じる
                </Button>
                <Button
                  onClick={() => {
                    handleCreateClick();
                    setIsOpenCreateModal(false);
                  }}
                  color="primary"
                >
                  作成
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="mt-4">
        {dataSource.map((data) => {
          return (
            <>
              <div key={data.key} className="d-flex w-full mt-4">
                <Card>
                  <CardHeader>
                    <div className="">{data.title}</div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="whitespace-pre-wrap">{data.content}</div>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <div className="ml-auto mr-0 mt-0 mb-0">
                      <Button
                        onPress={() => handleEditClick(data.id)}
                        color="primary"
                        className="ml-auto mr-0 mt-0 mb-0"
                      >
                        編集
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleDeleteClick(data.id)}
                        className="ml-4"
                      >
                        削除
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <Modal
                isOpen={isOpenUpdateModal}
                placement="center"
                onOpenChange={onOpenChangeUpdateModal}
                className="m-4"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        メモを編集
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          label="Title"
                          key="default"
                          color="default"
                          value={title}
                          onChange={handleTitleChange}
                        ></Input>
                        <Textarea
                          label="Content"
                          placeholder="Enter content"
                          className="mt-2"
                          value={content}
                          onChange={handleContentChange}
                        ></Textarea>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          onPress={() => {
                            setIsOpenUpdateModal(false);
                          }}
                        >
                          閉じる
                        </Button>
                        <Button
                          onClick={() => {
                            handleUpdateClick(currentId);
                            setIsOpenUpdateModal(false);
                          }}
                          color="primary"
                        >
                          更新
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          );
        })}
      </div>
    </div>
  );
}
