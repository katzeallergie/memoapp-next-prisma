# このプロジェクト

Next.js + prisma を使った簡単なメモアプリ

Vercel
https://memoapp-next-prisma.vercel.app/

## Getting Started

Local での実行

```bash
npm run dev
```

初回実行時は prisma の DB 構築が必要

```bash
docker-compose up -d
npm run build
npm run start or npm run dev
```

## 本番環境での緊急時マイグレーション実行手順

本番環境で `transactions` テーブルが存在しない場合、以下のコマンドでマイグレーションを手動実行してください：

### ⚠️ マイグレーション競合エラーの解決

本番環境で「relation "memos" already exists」エラーが発生した場合：

#### 方法 1: マイグレーション履歴をリセット（推奨）

```bash
# 1. マイグレーション履歴をリセット
npx prisma migrate resolve --applied 20231102102952_init
npx prisma migrate resolve --applied 20231122140849_add_title

# 2. 新しいマイグレーションのみ実行
npx prisma migrate deploy
```

#### 方法 2: データベースを完全リセット（危険 - データ消失）

```bash
# ⚠️ 全データが削除されます
npx prisma migrate reset --force
```

#### 方法 3: 手動で transactions テーブルのみ作成

```sql
-- 本番データベースに直接実行
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- マイグレーション履歴に記録
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES (
    '20250607144230_add_transactions_table',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    NOW(),
    '20250607144230_add_transactions_table',
    '',
    NULL,
    NOW(),
    1
) ON CONFLICT (id) DO NOTHING;
```

### 1. Vercel 関数での実行 (推奨)

```

```
