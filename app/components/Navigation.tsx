import { Button } from '@nextui-org/react';

export default function Navigation() {
  return (
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
  );
}
