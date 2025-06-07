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

### 1. Vercel 関数での実行 (推奨)

```bash
# Vercelの本番環境で実行
npx prisma migrate deploy --schema=./prisma/dev/schema.prisma
```

### 2. ローカルから本番 DB に接続して実行

```bash
# 本番環境のDATABASE_URLを設定してから実行
npm run db:migrate:prod
```

### 3. 手動 SQL 実行 (最終手段)

本番データベースに直接接続して以下の SQL を実行：

```sql
-- CreateTable
CREATE TABLE "transactions" (
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
```

## 解決済みの問題

- ✅ Prisma 警告：`--no-engine` フラグを build:prod に追加
- ✅ マイグレーション追加：`transactions` テーブル用のマイグレーションファイルを作成
- ✅ デプロイ設定：本番環境で確実にマイグレーションが実行されるように修正
