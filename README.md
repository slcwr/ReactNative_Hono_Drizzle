# Weight Tracker - Full Stack Application

体重管理アプリケーション - Hasura (GraphQL) + Hono (REST API) + Drizzle ORM + React Native

## アーキテクチャ

### バックエンド構成

- **Hasura**: GraphQLエンジン（基本的なCRUD操作）
- **Hono**: 軽量REST APIフレームワーク（外部API連携）
- **Drizzle ORM**: TypeScript-first ORM
- **PostgreSQL**: データベース

### フロントエンド

- **React Native (Expo)**: モバイルアプリ

## プロジェクト構造

```
.
├── backend/                 # Hono API サーバー
│   ├── src/
│   │   ├── db/             # Drizzle ORM設定とスキーマ
│   │   ├── routes/         # APIルート
│   │   └── index.ts        # エントリーポイント
│   ├── drizzle/            # マイグレーションファイル
│   ├── drizzle.config.ts   # Drizzle設定
│   ├── package.json
│   └── Dockerfile
├── hasura/                 # Hasura設定
│   ├── metadata/           # Hasuraメタデータ
│   └── config.yaml
├── mobile/                 # React Nativeアプリ
│   └── src/
└── .devcontainer/          # Docker開発環境
    └── docker-compose.yml
```

## セットアップ手順

### 1. 依存関係のインストール

#### バックエンド
```bash
cd backend
npm install
```

#### モバイル
```bash
cd mobile
npm install
```

### 2. 環境変数の設定

```bash
cd backend
cp .env.example .env
# 必要に応じて.envを編集
```

### 3. Dockerコンテナの起動

```bash
cd .devcontainer
docker-compose up -d
```

起動するサービス:
- **PostgreSQL**: `localhost:5432`
- **Hasura Console**: `http://localhost:8080`
- **Hono API**: `http://localhost:3000`

### 4. データベースマイグレーション

```bash
cd backend
npm run db:push
```

### 5. Hasuraメタデータの適用

Hasura Consoleにアクセス: `http://localhost:8080`

Admin Secret: `myadminsecretkey`

または、CLIを使用:
```bash
cd hasura
hasura metadata apply
```

## データベーススキーマ

### users
- ユーザー情報を管理

### weight_records
- 体重記録を管理
- usersテーブルとリレーション

### api_logs
- 外部API呼び出しのログを記録

## API エンドポイント

### Hasura GraphQL API
- エンドポイント: `http://localhost:8080/v1/graphql`
- Admin Secret: `myadminsecretkey`
- 基本的なCRUD操作（users, weight_records）

### Hono REST API
- ベースURL: `http://localhost:3000`

#### エンドポイント一覧

**Health Check**
```
GET /health
```

**外部API連携**
```
POST /api/external/webhook      # Webhookレシーバー
GET  /api/external/fetch-data   # 外部データ取得
POST /api/external/sync         # データ同期
GET  /api/external/logs         # APIログ取得
```

## 開発コマンド

### バックエンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# Drizzle Studio起動（DB GUI）
npm run db:studio

# マイグレーション生成
npm run db:generate

# マイグレーション実行
npm run db:migrate
```

### モバイル

```bash
# 開発サーバー起動
npm start

# トンネルモードで起動（リモートアクセス可能）
npm run start:tunnel

# Android
npm run android

# iOS
npm run ios
```

## Hasura 権限設定

### userロール
- **users**: 自分のデータのみ読み書き可能
- **weight_records**: 自分の記録のみCRUD可能

### adminロール
- すべてのテーブルにフルアクセス
- api_logsの閲覧可能

## 外部API連携の例

### Webhookの受信

```bash
curl -X POST http://localhost:3000/api/external/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "user.created",
    "data": {
      "userId": 1,
      "email": "user@example.com"
    }
  }'
```

### 外部データの同期

```bash
curl -X POST http://localhost:3000/api/external/sync \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "action": "create",
    "data": {
      "weight": 70.5,
      "unit": "kg"
    }
  }'
```

## トラブルシューティング

### データベース接続エラー
```bash
# コンテナの状態確認
docker-compose ps

# ログ確認
docker-compose logs db
docker-compose logs hasura
docker-compose logs hono-api
```

### Hasuraメタデータが適用されない
```bash
cd hasura
hasura metadata reload
```

### Drizzleマイグレーションエラー
```bash
# データベースをリセット
docker-compose down -v
docker-compose up -d
cd backend
npm run db:push
```

## 次のステップ

1. 認証機能の追加（Hasura JWT、Auth0など）
2. 実際の外部API統合（例: ヘルスケアAPI、通知サービス）
3. GraphQL Subscriptionsの実装
4. モバイルアプリとAPIの統合
5. テストの追加

## ライセンス

MIT
