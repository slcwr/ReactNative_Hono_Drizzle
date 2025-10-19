# Weight Tracker Mobile App

React Nativeで構築された体重記録アプリ

## セットアップ

```bash
cd mobile
npm install
```

## 起動方法

```bash
# 開発サーバーを起動
npm start

# iOSシミュレータで起動
npm run ios

# Androidエミュレータで起動
npm run android

# Webブラウザで起動
npm run web
```

## プロジェクト構成

```
mobile/
├── src/
│   ├── app/                    # アプリケーション全体の設定
│   │   ├── navigation/         # ナビゲーション
│   │   ├── providers/          # コンテキストプロバイダー
│   │   └── theme/              # グローバルテーマ
│   │
│   ├── features/               # 機能ごとに分割
│   │   ├── weight/             # 体重記録機能
│   │   ├── goal/               # 目標設定機能
│   │   ├── statistics/         # 統計・グラフ機能
│   │   ├── profile/            # プロフィール機能
│   │   └── auth/               # 認証機能（将来）
│   │
│   ├── shared/                 # 共有リソース
│   │   ├── components/         # 共通UIコンポーネント
│   │   ├── hooks/              # 共通フック
│   │   ├── graphql/            # GraphQL設定・クエリ
│   │   ├── types/              # 共通型定義
│   │   └── utils/              # 共通ユーティリティ
│   │
│   └── entities/               # ビジネスエンティティ
│       ├── weight/             # 体重エンティティ
│       ├── user/               # ユーザーエンティティ
│       └── goal/               # 目標エンティティ
│
└── App.tsx
```

## 使用技術

- React Native (Expo)
- TypeScript
- React Navigation
