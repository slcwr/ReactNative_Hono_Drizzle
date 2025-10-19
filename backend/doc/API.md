# Weight Records CRUD API Documentation

REST APIエンドポイント for weight records management.

Base URL: `http://localhost:3000`

## Endpoints

### 1. Get All Weight Records

全ての体重記録を取得（ページネーション・フィルタリング対応）

```
GET /api/weight-records
```

**Query Parameters:**
- `userId` (optional): ユーザーIDでフィルタリング
- `limit` (optional, default: 50): 取得件数
- `offset` (optional, default: 0): オフセット

**Example Request:**
```bash
curl http://localhost:3000/api/weight-records?userId=1&limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
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
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1
  }
}
```

---

### 2. Get Weight Record by ID

特定の体重記録を取得

```
GET /api/weight-records/:id
```

**Path Parameters:**
- `id` (required): 体重記録のID

**Example Request:**
```bash
curl http://localhost:3000/api/weight-records/1
```

**Response:**
```json
{
  "success": true,
  "data": {
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
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Weight record not found"
}
```

---

### 3. Get Weight Records by User ID

特定ユーザーの全体重記録を取得

```
GET /api/weight-records/user/:userId
```

**Path Parameters:**
- `userId` (required): ユーザーID

**Example Request:**
```bash
curl http://localhost:3000/api/weight-records/user/1
```

**Response:**
```json
{
  "success": true,
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
  "count": 1
}
```

---

### 4. Create Weight Record

新しい体重記録を作成

```
POST /api/weight-records
```

**Request Body:**
```json
{
  "userId": 1,
  "weight": "70.50",
  "unit": "kg",
  "notes": "Morning weight",
  "recordedAt": "2025-10-19T08:00:00.000Z"
}
```

**Required Fields:**
- `userId` (number): ユーザーID
- `weight` (string): 体重（小数点以下2桁まで）

**Optional Fields:**
- `unit` (string): 単位（"kg" or "lbs"、default: "kg"）
- `notes` (string): メモ
- `recordedAt` (string): 記録日時（ISO 8601形式、default: 現在時刻）

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/weight-records \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "weight": "70.50",
    "unit": "kg",
    "notes": "Morning weight"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Weight record created successfully",
  "data": {
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
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Weight must be a valid number with up to 2 decimal places"
}
```

---

### 5. Update Weight Record (Full Update)

体重記録を更新（全フィールド）

```
PUT /api/weight-records/:id
```

**Path Parameters:**
- `id` (required): 体重記録のID

**Request Body:**
```json
{
  "weight": "71.00",
  "unit": "kg",
  "notes": "Evening weight",
  "recordedAt": "2025-10-19T20:00:00.000Z"
}
```

**All Fields Optional:**
- `weight` (string): 体重
- `unit` (string): 単位
- `notes` (string): メモ
- `recordedAt` (string): 記録日時

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/weight-records/1 \
  -H "Content-Type: application/json" \
  -d '{
    "weight": "71.00",
    "notes": "Updated weight"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Weight record updated successfully",
  "data": {
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
```

---

### 6. Partial Update (PATCH)

体重記録を部分的に更新

```
PATCH /api/weight-records/:id
```

**同じ動作をPUTと同様に実装**

---

### 7. Delete Weight Record

体重記録を削除

```
DELETE /api/weight-records/:id
```

**Path Parameters:**
- `id` (required): 体重記録のID

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/weight-records/1
```

**Response:**
```json
{
  "success": true,
  "message": "Weight record deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Weight record not found"
}
```

---

## Error Responses

全てのエンドポイントで以下のエラーレスポンス形式を使用：

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid ID parameter"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Weight record not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Database connection error"
}
```

---

## Data Validation

### Weight Format
- 正規表現: `^\d+(\.\d{1,2})?$`
- 例: "70", "70.5", "70.50" ✅
- 例: "70.555", "abc" ❌

### Unit Values
- 許可される値: `"kg"` または `"lbs"`

### DateTime Format
- ISO 8601形式: `YYYY-MM-DDTHH:mm:ss.sssZ`
- 例: "2025-10-19T08:00:00.000Z" ✅

---

## Testing Examples

### Create a test user and weight records:

```bash
# Create weight record
curl -X POST http://localhost:3000/api/weight-records \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "weight": "70.50",
    "unit": "kg",
    "notes": "Morning weight"
  }'

# Get all records
curl http://localhost:3000/api/weight-records

# Get user's records
curl http://localhost:3000/api/weight-records/user/1

# Update record
curl -X PUT http://localhost:3000/api/weight-records/1 \
  -H "Content-Type: application/json" \
  -d '{
    "weight": "71.00"
  }'

# Delete record
curl -X DELETE http://localhost:3000/api/weight-records/1
```

---

## Notes

- すべてのレスポンスは JSON 形式
- 日時は UTC タイムゾーン
- ページネーションのデフォルト: limit=50, offset=0
- 削除は物理削除（レコードを完全に削除）
- `userId`の存在確認は行っていない（外部キー制約に依存）
