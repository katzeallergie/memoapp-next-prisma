import MemoCard from './MemoCard';
import { MemoType } from '../types/memo';

interface MemoListProps {
  memos: MemoType[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function MemoList({ memos, onEdit, onDelete }: MemoListProps) {
  return (
    <div className="mt-4">
      {memos.map((memo) => (
        <MemoCard
          key={memo.key}
          id={memo.id}
          title={memo.title}
          content={memo.content}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
