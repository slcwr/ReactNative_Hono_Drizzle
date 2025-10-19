# Backend API - Hono + Drizzle ORM

Honoを使用した軽量REST APIサーバー。外部API連携とDrizzle ORMによるデータベース操作を提供します。

## 技術スタック

- **Hono**: 軽量で高速なWebフレームワーク
- **Drizzle ORM**: TypeScript-first ORM
- **PostgreSQL**: データベース
- **Zod**: バリデーション
- **TypeScript**: 型安全性

## ディレクトリ構造

```
backend/
├── src/
│   ├── db/
│   │   ├── schema.ts      # データベーススキーマ定義
│   │   └── index.ts       # DB接続設定
│   ├── routes/
│   │   ├── health.ts      # ヘルスチェック
│   │   └── external-api.ts # 外部API連携
│   └── index.ts           # アプリケーションエントリーポイント
├── drizzle/               # 自動生成されるマイグレーション
├── drizzle.config.ts      # Drizzle設定
├── tsconfig.json
├── package.json
└── Dockerfile
```

## セットアップ

### インストール

```bash
npm install
```

### 環境変数

`.env`ファイルを作成:

```env
DATABASE_URL=postgres://postgres:postgres@db:5432/appdb
PORT=3000
NODE_ENV=development
HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey
HASURA_GRAPHQL_ENDPOINT=http://hasura:8080
EXTERNAL_API_KEY=your-api-key-here
```

### データベースマイグレーション

```bash
# スキーマをデータベースにプッシュ（開発時）
npm run db:push

# マイグレーションファイル生成
npm run db:generate

# マイグレーション実行
npm run db:migrate
```

### 開発サーバー起動

```bash
npm run dev
```

サーバーは`http://localhost:3000`で起動します。

## APIエンドポイント

### ルート
```
GET /
```

APIの基本情報を返します。

### ヘルスチェック
```
GET /health
```

サーバーとデータベースの状態を確認します。

レスポンス例:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-19T12:00:00.000Z",
  "database": "connected"
}
```

### 外部API連携

#### Webhook受信
```
POST /api/external/webhook
```

外部サービスからのWebhookを受信します。

リクエスト例:
```json
{
  "event": "user.created",
  "data": {
    "userId": 1,
    "email": "user@example.com"
  }
}
```

#### 外部データ取得
```
GET /api/external/fetch-data
```

外部APIからデータを取得します。

#### データ同期
```
POST /api/external/sync
```

データを外部サービスに同期します。

リクエスト例:
```json
{
  "userId": 1,
  "action": "create",
  "data": {
    "weight": 70.5,
    "unit": "kg"
  }
}
```

#### APIログ取得
```
GET /api/external/logs
```

外部API呼び出しのログを取得します（最新50件）。

## データベーススキーマ

### users
```typescript
{
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### weight_records
```typescript
{
  id: number;
  userId: number;
  weight: string;
  unit: string;
  notes: string | null;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### api_logs
```typescript
{
  id: number;
  endpoint: string;
  method: string;
  statusCode: number | null;
  requestBody: string | null;
  responseBody: string | null;
  errorMessage: string | null;
  createdAt: Date;
}
```

## Drizzle ORM

### Drizzle Studio

データベースをGUIで操作:

```bash
npm run db:studio
```

ブラウザで`https://local.drizzle.studio`が開きます。

### スキーマ変更

1. `src/db/schema.ts`を編集
2. マイグレーション生成:
```bash
npm run db:generate
```
3. マイグレーション適用:
```bash
npm run db:migrate
```

または開発時は直接プッシュ:
```bash
npm run db:push
```

## 開発のヒント

### 新しいルートの追加

1. `src/routes/`に新しいファイルを作成
2. `src/index.ts`でルートを登録

例:
```typescript
// src/routes/my-route.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Hello!' });
});

export default app;

// src/index.ts
import myRoute from './routes/my-route';

app.route('/api/my-route', myRoute);
```

### バリデーション

Zodを使用した型安全なバリデーション:

```typescript
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  age: z.number().min(0),
});

app.post('/user', zValidator('json', schema), async (c) => {
  const data = c.req.valid('json');
  // dataは型安全
  return c.json({ success: true });
});
```

### エラーハンドリング

```typescript
app.get('/example', async (c) => {
  try {
    // 処理
    return c.json({ success: true });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});
```

## 本番デプロイ

### ビルド

```bash
npm run build
```

### 起動

```bash
npm start
```

### Docker

```bash
docker build -t weight-tracker-api .
docker run -p 3000:3000 --env-file .env weight-tracker-api
```

## トラブルシューティング

### データベース接続エラー

- `DATABASE_URL`が正しいか確認
- PostgreSQLコンテナが起動しているか確認

### マイグレーションエラー

- データベースをリセット:
```bash
docker-compose down -v
docker-compose up -d db
npm run db:push
```

### ポートが使用中

- `.env`の`PORT`を変更
- または使用中のプロセスを終了

## 参考リンク

- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Zod Documentation](https://zod.dev/)
