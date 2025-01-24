# Task-Memo概要ドキュメント
[Task-Memo](https://www.task-memo.com/)は日常のタスク管理を効率化し、  
直感的な操作性を実現するために開発したアプリケーションです。

**認証機能やドラッグ＆ドロップによるタスク並び替え**など、  
効率的なタスク管理をサポートする機能を搭載しています。

このアプリは、**未経験からの転職を目指し実践的なスキルを身につける**ため、  
モダンな技術スタックを活用して一つのアプリを作り切ることを目標に開発しました。

実務でのチーム開発を想定し、RailsとReactを組み合わせたモノレポ構成での開発に挑戦しています。  
同様に、インフラもAWSでの構築に挑戦しました。

本ドキュメントは概要版であり、アプリの全体像をざっと理解したい方や  
人事担当者など、非エンジニアの方向けに詳細を省いた内容となっています。

エンジニア向けの[詳細ドキュメント](./docs/DETAILS.md)はこちら。

## 主な機能
- **ユーザー認証**
  - メールアドレス認証 / パスワードリセット / ゲストログイン
- **タスク管理**
  - タスクとボード（タスクグループ）のCRUD機能
  - 検索、絞り込み、並び替え（ドラッグ＆ドロップ対応）

## 動作イメージ
### タスクCRUD
タスクの作成、表示、編集、削除を簡単に操作できます。  
![タスクCRUD](./front/public/images/task.gif)

### 並び替え (ドラッグ＆ドロップ)
直感的な操作でタスクの優先順位を調整できます。
![並び替え](./front/public/images/sort.gif)

### ゲストログイン
登録不要で簡単にアプリの機能を試せるため、初めてのユーザーでも操作を気軽に体験できます。
![ゲストログイン](./front/public/images/guestlogin.gif)

## 技術スタック

### 開発環境
- **Docker**: ローカルと本番の環境差異を排除した統一的な構築。
- **モノレポ構成**: フロントエンドとバックエンドを1つのリポジトリで管理。

### フロントエンド
- **TypeScript**: 型安全性を確保し、保守性を向上。
- **React**: 再利用可能なコンポーネント設計。
- **Chakra UI**: 統一感のあるデザインを簡潔に構築。
- **Vite**: 高速なビルドとホットリロードを実現。

### バックエンド
- **Ruby on Rails**: 高い生産性と信頼性を持つWebフレームワーク。
- **MySQL**: 大量データの高速処理と安定した運用を実現。

### インフラ
- **AWS ECS**: コンテナ単位で柔軟にスケールアップ可能。
- **RDS (Aurora MySQL)**: 高い耐障害性とデータ整合性。
- **S3**: 静的ファイルの保存とバックアップ管理。
- **CloudWatch**: リアルタイム監視とログ管理を実現。
- **Vercel**: 静的サイトのホスティング。

#### インフラ構成図
この構成により、フロントエンドとバックエンドを分離しつつ、アクセス増加時に柔軟にスケールアップ対応が可能です。
![インフラ構成図](./front/public/images/infra.png)

## 設計のポイント
- **直感的な操作性**:  
  ドラッグ＆ドロップ機能を導入し、タスクの並び替えを効率化。  
  **検索・絞り込み**により必要な情報をすばやく取得可能。
- **高速な開発環境**:  
  Viteを採用し、ビルド時間を短縮。ホットリロードにより開発体験を向上。
- **開発効率とチーム開発への配慮**:  
  Dockerとモノレポ構成で環境差異を排除し、スムーズなデプロイと統一的なコード管理を実現。
- **スケーラビリティ**:  
  AWS ECSを使用したアーキテクチャで、負荷に応じた柔軟なスケールアップが可能。

## 開発記録
開発中に直面した課題やトラブル解決のプロセスを、Qiitaにまとめています。  
- [モノレポ構成とCORSの解決策](https://qiita.com/kumazaki-y/items/7acbbfdbac9a838477a1))
- [AWS構築で直面した課題と解決](https://qiita.com/kumazaki-y/items/dc8c9270a6b73df1a765)
- [Vite×Dockerでのビルドエラー対応](https://qiita.com/kumazaki-y/items/9faf6ab4712d4c6e5c72)


