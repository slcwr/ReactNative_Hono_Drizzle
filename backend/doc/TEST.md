# GraphQL Resolvers Test Documentation

JestでGraphQLリゾルバーをテストする方法

## セットアップ

### 1. 依存関係のインストール

```bash
cd backend
npm install
```

インストールされるテスト関連パッケージ：
- `jest` - テストフレームワーク
- `ts-jest` - TypeScriptサポート
- `@types/jest` - Jest型定義

### 2. テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジレポートを生成
npm run test:coverage
```

---

## テスト構成

### ファイル構造

```
backend/
├── src/
│   └── graphql/
│       ├── __tests__/
│       │   └── resolvers.test.ts    # テストファイル
│       ├── resolvers.ts              # テスト対象
│       ├── schema.ts
│       └── index.ts
├── jest.config.js                    # Jest設定
└── package.json
```

### Jest設定 (jest.config.js)

- TypeScriptサポート（ts-jest使用）
- ESモジュール対応
- テストファイルパターン: `**/__tests__/**/*.test.ts`
- カバレッジ収集設定

---

## テストケース

### Query.weightRecords

#### ✅ 正常系: ページネーション付きで記録を取得
```typescript
it('should return weight records with pagination', async () => {
  // userId=1で10件取得、オフセット0
  const result = await resolvers.Query.weightRecords(null, {
    userId: 1,
    limit: 10,
    offset: 0,
  });

  expect(result).toHaveProperty('data');
  expect(result).toHaveProperty('total');
  expect(result).toHaveProperty('hasMore');
});
```

#### ✅ 空の結果を処理
```typescript
it('should handle empty results', async () => {
  const result = await resolvers.Query.weightRecords(null, {
    limit: 10,
    offset: 0,
  });

  expect(result.data).toHaveLength(0);
  expect(result.total).toBe(0);
});
```

---

### Query.weightRecord

#### ✅ 正常系: 単一レコードを取得
```typescript
it('should return a single weight record', async () => {
  const result = await resolvers.Query.weightRecord(null, { id: 1 });

  expect(result).toBeDefined();
  expect(result?.id).toBe(1);
});
```

#### ✅ 存在しないレコードはnullを返す
```typescript
it('should return null for non-existent record', async () => {
  const result = await resolvers.Query.weightRecord(null, { id: 999 });

  expect(result).toBeNull();
});
```

---

### Query.weightRecordsByUser

#### ✅ 正常系: ユーザーの全記録を取得
```typescript
it('should return all records for a user', async () => {
  const result = await resolvers.Query.weightRecordsByUser(null, { userId: 1 });

  expect(result).toHaveLength(2);
  expect(result[0].userId).toBe(1);
});
```

---

### Mutation.createWeightRecord

#### ✅ 正常系: 新規作成
```typescript
it('should create a new weight record', async () => {
  const result = await resolvers.Mutation.createWeightRecord(null, {
    input: {
      userId: 1,
      weight: '70.50',
      unit: 'kg',
      notes: 'New record',
    },
  });

  expect(result).toBeDefined();
  expect(result.weight).toBe('70.50');
});
```

#### ❌ 異常系: 無効な体重フォーマット
```typescript
it('should throw error for invalid weight format', async () => {
  await expect(
    resolvers.Mutation.createWeightRecord(null, {
      input: {
        userId: 1,
        weight: 'invalid',
        unit: 'kg',
      },
    })
  ).rejects.toThrow('Weight must be a valid number with up to 2 decimal places');
});
```

#### ❌ 異常系: 無効な単位
```typescript
it('should throw error for invalid unit', async () => {
  await expect(
    resolvers.Mutation.createWeightRecord(null, {
      input: {
        userId: 1,
        weight: '70.50',
        unit: 'invalid',
      },
    })
  ).rejects.toThrow('Unit must be either "kg" or "lbs"');
});
```

#### ✅ デフォルト値: 単位が未指定の場合
```typescript
it('should use default unit "kg" if not provided', async () => {
  const result = await resolvers.Mutation.createWeightRecord(null, {
    input: {
      userId: 1,
      weight: '70.50',
    },
  });

  expect(result.unit).toBe('kg');
});
```

---

### Mutation.updateWeightRecord

#### ✅ 正常系: レコードを更新
```typescript
it('should update a weight record', async () => {
  const result = await resolvers.Mutation.updateWeightRecord(null, {
    id: 1,
    input: {
      weight: '71.00',
      notes: 'Updated note',
    },
  });

  expect(result.weight).toBe('71.00');
  expect(result.notes).toBe('Updated note');
});
```

#### ❌ 異常系: 存在しないレコード
```typescript
it('should throw error for non-existent record', async () => {
  await expect(
    resolvers.Mutation.updateWeightRecord(null, {
      id: 999,
      input: { weight: '71.00' },
    })
  ).rejects.toThrow('Weight record not found');
});
```

#### ❌ 異常系: 無効な体重フォーマット
```typescript
it('should validate weight format on update', async () => {
  await expect(
    resolvers.Mutation.updateWeightRecord(null, {
      id: 1,
      input: { weight: 'invalid' },
    })
  ).rejects.toThrow('Weight must be a valid number with up to 2 decimal places');
});
```

---

### Mutation.deleteWeightRecord

#### ✅ 正常系: レコードを削除
```typescript
it('should delete a weight record', async () => {
  const result = await resolvers.Mutation.deleteWeightRecord(null, { id: 1 });

  expect(result.success).toBe(true);
  expect(result.message).toBe('Weight record deleted successfully');
});
```

#### ❌ 異常系: 存在しないレコード
```typescript
it('should throw error for non-existent record', async () => {
  await expect(
    resolvers.Mutation.deleteWeightRecord(null, { id: 999 })
  ).rejects.toThrow('Weight record not found');
});
```

---

## テストカバレッジ

テストカバレッジレポートを生成：

```bash
npm run test:coverage
```

カバレッジレポートは `coverage/` ディレクトリに生成されます。

### 期待されるカバレッジ

- **Queries**: 100%
  - weightRecords (正常系・異常系)
  - weightRecord (正常系・null返却)
  - weightRecordsByUser (正常系)

- **Mutations**: 100%
  - createWeightRecord (正常系・バリデーション)
  - updateWeightRecord (正常系・存在確認・バリデーション)
  - deleteWeightRecord (正常系・存在確認)

---

## モッキング戦略

### データベースのモック

```typescript
jest.mock('../../db/index', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  weightRecords: { /* table schema */ },
  users: { /* table schema */ },
}));
```

### モックチェーンの例

```typescript
const mockSelect = {
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockResolvedValue(mockRecords),
};

mockDb.select.mockReturnValue(mockSelect);
```

---

## CI/CDでの実行

### GitHub Actions例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm install
      - run: cd backend && npm test
      - run: cd backend && npm run test:coverage
```

---

## トラブルシューティング

### ESModuleエラー

TypeScriptのESモジュールで問題が発生する場合：

1. `jest.config.js`の設定を確認
2. `package.json`に`"type": "module"`があることを確認
3. importパスに`.js`拡張子を付ける

### モックが動作しない

```typescript
// ❌ 間違い
import { db } from '../../db/index';

// ✅ 正しい
import * as dbModule from '../../db/index';
const mockDb = (dbModule as any).db;
```

---

## ベストプラクティス

1. **各リゾルバーを独立してテスト**
2. **正常系と異常系の両方をカバー**
3. **エッジケースをテスト**（空配列、null、未定義値など）
4. **バリデーションロジックを徹底的にテスト**
5. **モックを適切にクリーンアップ**（`beforeEach`で`jest.clearAllMocks()`）

---

## 次のステップ

- [ ] 統合テストの追加（実際のGraphQLクエリを実行）
- [ ] E2Eテストの追加
- [ ] パフォーマンステスト
- [ ] スナップショットテスト
- [ ] テストデータファクトリーの作成
