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
  useDisclosure,
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

  const handleSaveClick = async () => {
    if (content == '' || title == '') {
      return;
    }
    const response = await fetch('/api/memos', {
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
    const response = await fetch(`/api/memos?id=${id}`, {
      method: 'DELETE',
    });

    const memos = await response.json();
    setDataSource(memos);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="h-screen p-8">
      <h1 className="text-xl text-center">クソ雑MemoApp</h1>
      <div className="w-full my-6 flex">
        <Button
          onPress={onOpen}
          color="primary"
          className="ml-auto mr-0 mt-0 mb-0"
        >
          メモを追加
        </Button>
      </div>

      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} className='m-4'>
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
                <Button color="danger" onPress={onClose}>
                  閉じる
                </Button>
                <Button
                  onClick={() => {
                    handleSaveClick();
                    onClose();
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
                  <Button
                    color="danger"
                    onClick={() => handleDeleteClick(data.id)}
                    className="mt-2"
                  >
                    削除
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
