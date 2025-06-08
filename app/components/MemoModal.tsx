import { ChangeEvent } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@nextui-org/react';

interface MemoModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  content: string;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

export default function MemoModal({
  isOpen,
  onOpenChange,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
  isEdit = false,
}: MemoModalProps) {
  const modalTitle = isEdit ? 'メモを編集' : 'メモを追加';
  const submitButtonText = isEdit ? '更新' : '作成';

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
      className="m-4"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {modalTitle}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Title"
                key="default"
                color="default"
                value={title}
                onChange={onTitleChange}
              />
              <Textarea
                label="Content"
                placeholder="Enter content"
                className="mt-2"
                value={content}
                onChange={onContentChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                閉じる
              </Button>
              <Button
                onClick={() => {
                  onSubmit();
                  onClose();
                }}
                color="primary"
              >
                {submitButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
