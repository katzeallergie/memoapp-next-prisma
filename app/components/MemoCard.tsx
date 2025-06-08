import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';

interface MemoCardProps {
  id: number;
  title: string;
  content: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function MemoCard({
  id,
  title,
  content,
  onEdit,
  onDelete,
}: MemoCardProps) {
  return (
    <div className="d-flex w-full mt-4">
      <Card>
        <CardHeader>
          <div className="">{title}</div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="whitespace-pre-wrap">{content}</div>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="ml-auto mr-0 mt-0 mb-0">
            <Button
              onPress={() => onEdit(id)}
              color="primary"
              className="ml-auto mr-0 mt-0 mb-0"
            >
              編集
            </Button>
            <Button
              color="danger"
              onClick={() => onDelete(id)}
              className="ml-4"
            >
              削除
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
