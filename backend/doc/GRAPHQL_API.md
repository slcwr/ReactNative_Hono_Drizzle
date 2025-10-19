# GraphQL API Documentation

Weight Tracker GraphQL API - Complete CRUD operations for weight records

## Endpoint

```
http://localhost:3000/graphql
```

## GraphiQL Playground

ブラウザで以下にアクセスすると、インタラクティブなGraphQL Playgroundが開きます：

```
http://localhost:3000/graphql
```

---

## Schema Overview

### Types

#### WeightRecord
```graphql
type WeightRecord {
  id: Int!
  userId: Int!
  weight: String!
  unit: String!
  notes: String
  recordedAt: String!
  createdAt: String!
  updatedAt: String!
}
```

#### User
```graphql
type User {
  id: Int!
  email: String!
  name: String!
  createdAt: String!
  updatedAt: String!
  weightRecords: [WeightRecord!]!
}
```

#### WeightRecordsConnection
```graphql
type WeightRecordsConnection {
  data: [WeightRecord!]!
  total: Int!
  hasMore: Boolean!
}
```

### Input Types

#### CreateWeightRecordInput
```graphql
input CreateWeightRecordInput {
  userId: Int!
  weight: String!
  unit: String        # "kg" or "lbs", default: "kg"
  notes: String
  recordedAt: String  # ISO 8601 format
}
```

#### UpdateWeightRecordInput
```graphql
input UpdateWeightRecordInput {
  weight: String
  unit: String
  notes: String
  recordedAt: String
}
```

---

## Queries

### 1. Get All Weight Records

全ての体重記録を取得（ページネーション・フィルタリング対応）

```graphql
query GetWeightRecords($userId: Int, $limit: Int, $offset: Int) {
  weightRecords(userId: $userId, limit: $limit, offset: $offset) {
    data {
      id
      userId
      weight
      unit
      notes
      recordedAt
      createdAt
      updatedAt
    }
    total
    hasMore
  }
}
```

**Variables:**
```json
{
  "userId": 1,
  "limit": 10,
  "offset": 0
}
```

**Response:**
```json
{
  "data": {
    "weightRecords": {
      "data": [
        {
          "id": 1,
          "userId": 1,
          "weight": "70.50",
          "unit": "kg",
          "notes": "Morning weight",
          "recordedAt": "2025-10-19T08:00:00.000Z",
          "createdAt": "2025-10-19T08:05:00.000Z",
          "updatedAt": "2025-10-19T08:05:00.000Z"
        }
      ],
      "total": 1,
      "hasMore": false
    }
  }
}
```

---

### 2. Get Single Weight Record

特定の体重記録を取得

```graphql
query GetWeightRecord($id: Int!) {
  weightRecord(id: $id) {
    id
    userId
    weight
    unit
    notes
    recordedAt
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "data": {
    "weightRecord": {
      "id": 1,
      "userId": 1,
      "weight": "70.50",
      "unit": "kg",
      "notes": "Morning weight",
      "recordedAt": "2025-10-19T08:00:00.000Z",
      "createdAt": "2025-10-19T08:05:00.000Z",
      "updatedAt": "2025-10-19T08:05:00.000Z"
    }
  }
}
```

---

### 3. Get Weight Records by User

特定ユーザーの全体重記録を取得

```graphql
query GetWeightRecordsByUser($userId: Int!) {
  weightRecordsByUser(userId: $userId) {
    id
    userId
    weight
    unit
    notes
    recordedAt
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "userId": 1
}
```

---

### 4. Get User with Weight Records

ユーザー情報と体重記録を同時に取得

```graphql
query GetUserWithRecords($id: Int!) {
  user(id: $id) {
    id
    email
    name
    createdAt
    updatedAt
    weightRecords {
      id
      weight
      unit
      notes
      recordedAt
    }
  }
}
```

**Variables:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-10-01T00:00:00.000Z",
      "updatedAt": "2025-10-01T00:00:00.000Z",
      "weightRecords": [
        {
          "id": 1,
          "weight": "70.50",
          "unit": "kg",
          "notes": "Morning weight",
          "recordedAt": "2025-10-19T08:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## Mutations

### 1. Create Weight Record

新しい体重記録を作成

```graphql
mutation CreateWeightRecord($input: CreateWeightRecordInput!) {
  createWeightRecord(input: $input) {
    id
    userId
    weight
    unit
    notes
    recordedAt
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "userId": 1,
    "weight": "70.50",
    "unit": "kg",
    "notes": "Morning weight",
    "recordedAt": "2025-10-19T08:00:00.000Z"
  }
}
```

**Response:**
```json
{
  "data": {
    "createWeightRecord": {
      "id": 1,
      "userId": 1,
      "weight": "70.50",
      "unit": "kg",
      "notes": "Morning weight",
      "recordedAt": "2025-10-19T08:00:00.000Z",
      "createdAt": "2025-10-19T08:05:00.000Z",
      "updatedAt": "2025-10-19T08:05:00.000Z"
    }
  }
}
```

---

### 2. Update Weight Record

体重記録を更新

```graphql
mutation UpdateWeightRecord($id: Int!, $input: UpdateWeightRecordInput!) {
  updateWeightRecord(id: $id, input: $input) {
    id
    userId
    weight
    unit
    notes
    recordedAt
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": 1,
  "input": {
    "weight": "71.00",
    "notes": "Updated weight"
  }
}
```

**Response:**
```json
{
  "data": {
    "updateWeightRecord": {
      "id": 1,
      "userId": 1,
      "weight": "71.00",
      "unit": "kg",
      "notes": "Updated weight",
      "recordedAt": "2025-10-19T08:00:00.000Z",
      "createdAt": "2025-10-19T08:05:00.000Z",
      "updatedAt": "2025-10-19T20:10:00.000Z"
    }
  }
}
```

---

### 3. Delete Weight Record

体重記録を削除

```graphql
mutation DeleteWeightRecord($id: Int!) {
  deleteWeightRecord(id: $id) {
    success
    message
  }
}
```

**Variables:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "data": {
    "deleteWeightRecord": {
      "success": true,
      "message": "Weight record deleted successfully"
    }
  }
}
```

---

## Error Handling

GraphQLのエラーは以下の形式で返されます：

```json
{
  "errors": [
    {
      "message": "Weight must be a valid number with up to 2 decimal places",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createWeightRecord"]
    }
  ],
  "data": null
}
```

### Common Errors

- `Weight must be a valid number with up to 2 decimal places`
- `Unit must be either "kg" or "lbs"`
- `Weight record not found`
- `Failed to fetch weight records: [error details]`

---

## Validation Rules

### Weight
- 形式: 整数または小数点以下2桁まで
- 正規表現: `^\d+(\.\d{1,2})?$`
- 例: ✅ "70", "70.5", "70.50" | ❌ "70.555", "abc"

### Unit
- 許可される値: `"kg"` または `"lbs"`
- デフォルト: `"kg"`

### DateTime
- 形式: ISO 8601
- 例: `"2025-10-19T08:00:00.000Z"`

---

## Complete Example Workflow

### 1. ユーザー作成（Hasuraまたは直接DB）

まずユーザーを作成する必要があります。

### 2. 体重記録を作成

```graphql
mutation {
  createWeightRecord(input: {
    userId: 1
    weight: "70.50"
    unit: "kg"
    notes: "Starting weight"
  }) {
    id
    weight
    recordedAt
  }
}
```

### 3. 記録を取得

```graphql
query {
  weightRecordsByUser(userId: 1) {
    id
    weight
    unit
    notes
    recordedAt
  }
}
```

### 4. 記録を更新

```graphql
mutation {
  updateWeightRecord(id: 1, input: {
    weight: "69.80"
    notes: "Lost some weight!"
  }) {
    id
    weight
    notes
    updatedAt
  }
}
```

### 5. 記録を削除

```graphql
mutation {
  deleteWeightRecord(id: 1) {
    success
    message
  }
}
```

---

## Using with HTTP Clients

### cURL Example

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateWeightRecord($input: CreateWeightRecordInput!) { createWeightRecord(input: $input) { id weight unit } }",
    "variables": {
      "input": {
        "userId": 1,
        "weight": "70.50",
        "unit": "kg"
      }
    }
  }'
```

### JavaScript/TypeScript Example

```typescript
const response = await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query GetWeightRecords($userId: Int!) {
        weightRecordsByUser(userId: $userId) {
          id
          weight
          unit
          recordedAt
        }
      }
    `,
    variables: {
      userId: 1,
    },
  }),
});

const data = await response.json();
console.log(data);
```

---

## Advanced Queries

### Pagination Example

```graphql
query {
  page1: weightRecords(limit: 10, offset: 0) {
    data { id weight }
    total
    hasMore
  }
  page2: weightRecords(limit: 10, offset: 10) {
    data { id weight }
    hasMore
  }
}
```

### Filtering by User with Pagination

```graphql
query {
  weightRecords(userId: 1, limit: 5, offset: 0) {
    data {
      id
      weight
      recordedAt
    }
    total
    hasMore
  }
}
```

---

## Tips

1. **GraphiQL Playground**を使用して、スキーマを探索し、クエリをテストできます
2. すべてのフィールドは必要なものだけ選択可能（柔軟性）
3. 1つのリクエストで複数のクエリを実行可能
4. TypeScriptの型定義は自動生成ツール（例: GraphQL Code Generator）を使用可能

---

## Next Steps

- GraphQL Code Generatorで型安全なクライアントコードを生成
- Apollo ClientまたはUrqlでフロントエンドと統合
- サブスクリプション機能の追加（リアルタイム更新）
- 認証・認可の実装
