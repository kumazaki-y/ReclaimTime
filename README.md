# Task-Memo

スキル向上を目的にポートフォリオとしてタスク管理アプリを作成しました。

シングルページアプリケーション (SPA) として主に下記の構成で作成しています。

- フロントエンドは **TypeScript / React**
- バックエンドは **Ruby on Rails**
- インフラは **Vercel (静的サイト) / AWS(API)**
- モノレポ構成
- バックエンドとフロントエンドの開発環境は両方ともDockerを使用

詳細は後述の「開発環境 (フロントエンド)」「開発環境 (バックエンド)」「本番環境」をご覧ください。

## 目次

- [機能](#機能)
- [開発環境 (フロントエンド)](#開発環境-フロントエンド)
- [開発環境 (バックエンド)](#開発環境-バックエンド)
- [本番環境](#本番環境)
  - [インフラ構成図](#インフラ構成図)
- [ER図](#ER図)
- [使用技術 (フロントエンド)](#使用技術-フロントエンド)
- [使用技術 (バックエンド)](#使用技術-バックエンド)
- [使用技術 (その他)](#使用技術-その他)
- [画面](#画面)

## 機能

### 認証
- ユーザー登録
- メールアドレス認証
  - 認証メール再送信
  - 未認証ユーザー削除 (定期処理)
- ログイン / ログアウト
  - Cookie / セッション
- ゲストユーザーログイン
- パスワードリセット
  - リセットメール認証

### タスク管理
- 作成 / 表示 / 更新 / 削除
- ボード（タスクグループ） 作成 / 表示 / 更新 / 削除
- タスク(各ボードに紐づく) 作成 / 表示 / 更新 / 削除
- 検索
- 絞り込み
- 並び替え    
  - ドラッグ&ドロップ  
  - 状態保持

## 開発環境 (フロントエンド)
フロントエンドにはTypeScriptとReactを採用しています。

TypeScriptを使用することで型安全性が強化され、開発効率とコードの可読性が向上しています。

ビルドツールにはViteを使用しており、迅速なビルドとホットリロードによって開発体験が快適になります。

実行環境のバージョン:

- Vite: 5.4.8
- Yarn: 1.22.22
- Node.js: v20.16.0
- TypeScript: 5.6.2
- React: 18
ブラウザにはChrome (Mac) を使用しています。

## 開発環境 (バックエンド)

バックエンドにはRuby on Railsを使用して、以下の構成で統合開発環境を整えています。

メール送信にはActionMailerを使用し、自分が所有しているgmailから送信テストを実行。

- Ruby (3.3.4)
- Ruby on Rails (7.1.3.4)
- MySQL (8.0.40)


## 本番環境

フロントエンドで生成された静的ファイルのホスティングには、Vercelを採用しています。  
バックエンドAPIの実行にはAWSの各種サービスを利用し、拡張性と運用効率を重視したインフラを構築しました。

### 各サービスの役割
- **Vercel**：静的ファイルホスティング。
- **VPC (Virtual Private Cloud)**：ネットワーク範囲を管理 (CIDR: 10.0.0.0/16)。
- **IGW (Internet Gateway)**：パブリックサブネット用のインターネットゲートウェイ。
- **パブリックサブネット**：外部と通信が必要なリソースを配置（例：ロードバランサー）。
- **ALB (Application Load Balancer)**：リクエストをECSタスクに分散。
- **プライベートサブネット**：データベースやアプリケーションサーバーを配置し、外部からのアクセスを制限。
- **ECS (Elastic Container Service)**：コンテナのオーケストレーションを管理。
- **RDS (Aurora MySQL)**：リレーショナルデータベース (RDB)。
- **ECR (Elastic Container Registry)**：Dockerイメージを保存。
- **IAM (Identity and Access Management)**：アクセス権限の管理。
- **Amazon SES (Simple Email Service)**：カスタムドメインからのメール送信。
- **Certificate Manager**：SSL/TLS証明書の発行。
- **CloudWatch**：ログ管理とモニタリング。
- **AWS Lambda**：未認証ユーザーの自動削除処理を実行。
  - AWS EventBridgeと連携して定期実行。
  - Secrets Managerを利用し、安全な認証情報管理を実現。
- **S3 (Simple Storage Service)**：RDSスナップショットの保存とバックアップ管理。

---

## インフラ構成図

アプリケーションの基本的な処理の流れは以下の通りです：

1. ユーザーはVercelにデプロイされたフロントエンドアプリケーションにアクセス。
2. APIリクエストは、パブリックサブネット内のALB (Application Load Balancer) を通じてバックエンドに送信。
3. ALBは、ECS (Elastic Container Service) によって管理されるRailsアプリケーションにリクエストを転送。
4. ECSは、以下の処理を実行：
   - RDSへのデータベースアクセス。
   - Amazon SESを利用したメール送信。
   - CloudWatchにログを送信し、監視・管理を実施。

以下は、この流れを示した構成図です：

![インフラ構成図](https://drive.google.com/uc?export=view&id=15h27Yh7qBIQCQLLvqESC4tHqccxOzL32)


---

## 各ポイントの詳細説明

### ECSとECRの連携
ECSはECRから最新のDockerイメージを取得し、アプリケーションのコンテナを実行します。この構成により、迅速かつセキュアなデプロイが可能です。業務での継続的デリバリーを見据えた設計となっています。

---

### ECSからCloudWatchへのログ送信
ECSは、アプリケーションの動作ログやエラーログをCloudWatchに送信します。これにより、エラー発生時の迅速な監視やトラブルシューティングが可能です。

---

### ALBとIGWの役割
ALBは、IGWを介してユーザーリクエストを受け取り、適切なECSタスクに振り分けます。HTTPS通信をサポートし、セキュリティとスケーラビリティを担保します。

---

### RDSの配置とセキュリティ設計
RDSはプライベートサブネットに配置され、外部からの直接アクセスを遮断しています。ECSのみがアクセス可能な設計により、安全なデータ管理を実現しています。

---

### Lambdaによる未認証ユーザーの自動削除
AWS Lambdaを活用し、未認証ユーザーの自動削除機能を実現しました。
1. **EventBridge**：スケジュール実行を設定。
2. **Secrets Manager**：認証情報の安全な管理を実施。
3. **RDSとの接続**：プライベートサブネット内で安全に通信。

---

### S3を活用したRDSのバックアップ管理
RDSスナップショットを定期的にS3へエクスポート。高い耐久性とコスト効率の良さから、長期的なバックアップストレージとして最適です。この設計により、データ損失リスクを最小化し、運用効率を向上させています。


## ER図

![ER図](https://drive.google.com/uc?export=view&id=1wmSFyD00zgSvfsyQ_NJvm8xy4nzcXmDK)

上記のER図は、タスク管理アプリケーションのためのデータベース構造を表しています。

主要なテーブルはusers、boards、tasksの3つで構成され、usersは認証情報を保持し、各ユーザーが作成したタスクの管理をサポートしています。

boardsはタスクをグループ化する単位であり、各boardは一人のユーザーに紐づけられます。

さらに、tasksは具体的なタスクの詳細を管理し、それぞれが特定のboardに所属しています。

このER図の作成には、dbdiagram.ioを使用しました。

このサービスはschema.rbなどの実際のモデル定義を貼り付けるだけでER図を生成します。

## 使用技術 (フロントエンド)

- **TypeScript (5.5.3)** - 静的型付けのプログラミング言語
- **React (18)** - UI構築ライブラリ
- **React Router Dom (6.26.1)** - ルーティング管理
- **Chakra UI (2.10.1)** - UIコンポーネントライブラリ
- **SWR (2.2.5)** - データフェッチングライブラリ
- **React Hook Form (7.53.1)** - フォームのバリデーションと管理
- **Yup (1.4.0)** - スキーマベースのバリデーションライブラリ
- **ESLint/Prettier/Stylelint** - コード品質と一貫性を保つためのツール

### TypeScript
TypeScriptを採用した主な理由は、静的型付けによる型安全性の確保と、コードの可読性・保守性の向上です。JavaScriptの柔軟性は残しつつ、型チェックを通じてバグの早期発見と予防が可能です。特にチーム開発においては、型情報があることで新しい開発者もコードを理解しやすく、意図しない型エラーが防げます。また、JavaScriptに比べてTypeScriptはIDEの補完機能が充実しており、生産性の向上につながります。VueやAngularでもTypeScriptは使用可能ですが、Reactのエコシステムとの相性が良いTypeScriptを選択しました。

### React + React Router Dom
UI構築には、再利用性とコンポーネントベースの開発手法に優れたReactを採用しました。Reactは他のフレームワーク（VueやAngular）と比較して、エコシステムが豊富であり、最新の開発トレンドにも柔軟に対応できます。特にReact Router Domを使用することで、シングルページアプリケーションにおける直感的かつ高速なページ遷移が実現でき、ユーザー体験を大幅に向上できます。VueやAngularに比べ、Reactのシンプルな設計と柔軟性が、スピーディーで拡張性の高い開発に適していると判断しました。

### Chakra UI + Emotion
UIコンポーネントライブラリには、開発速度と視覚的一貫性を重視してChakra UIを選定しました。Chakra UIはデザインガイドラインに基づいた豊富なコンポーネントを提供し、ビジュアルの一貫性が保てるため、デザイナーとエンジニア間での調整がスムーズに行えます。さらに、柔軟なスタイリングを可能にするEmotionを組み合わせることで、Tailwind CSSやMaterial-UIよりもデザインの自由度と統一感が得られます。特にChakra UIはアトミックデザインの構造にも適しており、迅速にモダンなUIを構築できる利点があります。

### SWR
SWRは、リアルタイムなデータフェッチングとキャッシュ管理が必要な環境でのパフォーマンス最適化に優れたライブラリです。SWRは、ReduxやReact Queryと比較しても軽量で、データのキャッシュ更新や自動再フェッチ機能が標準で備わっています。API通信の頻度が高い本プロジェクトでは、シンプルで直感的なSWRの利用により、エンドユーザーへの高速なレスポンスと効率的なデータ更新が実現できました。特に、Reactの標準APIのfetchよりも柔軟で、リアルタイムデータ更新に優れている点が採用の決め手です。

### React Hook Form + Yup
フォームバリデーションには、軽量で高速なReact Hook Formと、柔軟なスキーマバリデーションを提供するYupを組み合わせました。React Hook Formは、ネイティブのForm APIを活用するため、再レンダリングが少なく、他のフォーム管理ライブラリ（Formikなど）に比べてパフォーマンスが向上します。また、Yupとの連携により、複雑なバリデーションを簡潔に記述でき、ユーザー体験を向上できます。この組み合わせにより、バリデーションとエラーハンドリングがシンプルになり、開発生産性が向上しました。

### ESLint / Prettier / Stylelint
コードの品質を保つために、ESLintとPrettier、Stylelintを導入しました。ESLintはJavaScript/TypeScriptのエラーチェック、Prettierはコードの整形、StylelintはCSSの品質管理に使用しています。これらのツールを組み合わせることで、コードの一貫性が確保され、コードレビューの効率が向上しました。これにより、チーム全体でのコードスタイルの統一が図れ、メンテナンス性が向上しています。特に、複数人の開発者が関わるプロジェクトにおいて、チーム内での共通ルールの徹底が容易になります。

### テスト方法
テストにはJestの代わりに**curlコマンド**を使用しています。APIエンドポイントを直接テストするcurlは、軽量かつ直感的で、簡易的な動作確認には十分です。特に、APIのステータス確認やデバッグにおいて、過度な設定が不要で即時性が求められる場面において、curlは非常に効果的です。Jestによるユニットテストも考慮しましたが、今回のプロジェクト規模ではcurlによる直接テストの方が効率的であると判断しました。これにより、迅速にAPIの動作を確認し、開発スピードを維持しています。

## 使用技術（バックエンド）

- **Ruby (3.3.4)** - シンプルで直感的な文法を持つプログラミング言語。
- **Rails (7.1.4)** - Webアプリケーションフレームワーク。
- **MySQL (mysql2 ~> 0.5)** - リレーショナルデータベース。
- **Puma (6.4.2)** - 高性能なマルチスレッド対応アプリケーションサーバー。
- **Devise (4.9.4)** - ユーザー認証ライブラリ。
- **Devise Token Auth (1.2.3)** - トークンベースの認証をサポートし、セキュアなAPI通信を実現。
- **AWS Secrets Manager (1.108.0)** - 機密情報の管理。
- **Dotenv (3.1.2)** - 環境変数の管理。
- **Rack CORS (2.0.2)** - CORS設定（クロスオリジンリソース共有）を管理。

### Ruby + Rails
バックエンドにはRuby on Railsを採用しました。その主な理由は、**高い開発効率と迅速なプロトタイピング能力**です。Railsは、MVCアーキテクチャを提供し、コントローラー、モデル、ビューの各層にコードを分割することで、機能の追加や変更が容易に行えます。さらに、**ActiveRecordやActionCableなどの豊富な標準機能**が含まれており、外部ライブラリ（Gem）を活用することで、ログイン認証、メール配信、ファイルアップロードなどの一般的な機能を短期間で実装できます。  
Railsは、他のフレームワーク（DjangoやNode.jsのExpressなど）と比較しても、**フルスタックかつ「開発者の幸福」を重視**している点で優れており、特にスピードが重視されるプロジェクトでは高いパフォーマンスを発揮します。また、RubyとRailsのコミュニティは活発でドキュメントも豊富なため、トラブル解決が迅速に行える点も採用の大きな理由です。

### MySQL
データベースにはMySQLを選定しました。MySQLは**パフォーマンスの高さ、安定性、シンプルな運用**に強みがあり、データの一貫性とスケーラビリティを重視するシステムに適しています。PostgreSQLも候補にありましたが、MySQLは特に読み込み速度とシンプルな管理が求められる環境で信頼性が高く、Railsと組み合わせた経験が豊富なため、今回のプロジェクトにはMySQLが最適と判断しました。  
また、MySQLは広く普及しており、**エンジニア間での知見が豊富**であるため、チーム開発やサポート体制の整備においても有利です。

### Puma
アプリケーションサーバーにはPumaを採用しました。Pumaは**マルチスレッド対応で、リクエストの同時処理能力が高い**ため、アクセス集中に強い構成を実現します。特に、PumaはRailsに標準で採用されており、Railsとの親和性が高く、設定が簡単でありながら高いパフォーマンスを提供します。Unicornも候補にありましたが、Pumaは**スレッドベースで効率的にスケール**でき、サーバーリソースを効果的に利用できるため、選定しました。

### Devise + Devise Token Auth
ユーザー認証にはDeviseとDevise Token Authを組み合わせて使用しています。DeviseはRailsで広く使われており、**高いセキュリティと柔軟な認証機能の追加**が可能です。メール認証やパスワードリセットなどの一般的な認証機能が容易に実装でき、セキュアで信頼性のあるユーザー認証を短期間で導入できました。  
また、APIベースのアプリケーションと連携するため、トークンベースの認証が必要であり、**Devise Token Authの導入によりSPAやモバイルアプリケーション**ともシームレスに連携が可能です。この組み合わせにより、シンプルかつ安全に認証機能を実装できることが大きなメリットとなりました。

### AWS Secrets Manager
AWS Secrets Managerは、**機密情報を安全に保管・管理するためのツール**として採用しました。データベースのパスワードやAPIキーなどの機密情報を暗号化して保管し、アプリケーションが必要な時だけ動的に取得できるため、従来の環境変数管理よりも**セキュリティが向上**します。自動ローテーション機能も備えており、セキュリティの強化に加え、システム管理の手間を削減できるため、プロジェクトの安定運用に貢献します。

### Dotenv
開発・本番環境での設定を柔軟に切り替えるため、Dotenvを使用しています。Dotenvは**開発段階での環境変数管理をシンプルに行える**ため、異なる環境ごとの設定を簡単に変更でき、セキュリティの確保と同時に開発効率も向上します。また、AWS Secrets Managerなどの高度な管理ツールとも共存でき、**開発の初期段階での迅速な対応が可能**です。

### Rack CORS
Rack CORSを利用し、**クロスオリジンリソース共有（CORS）を適切に管理**しています。これにより、異なるドメインからのAPIリクエストを安全に許可し、ユーザーエクスペリエンスを損なうことなくセキュリティを確保します。特にフロントエンドとの連携を考慮した際に、CORSの適切な設定は重要であり、セキュリティ要件を満たすための基本的なツールとして採用しました。


### 使用技術 (その他)

- **Docker** - コンテナ管理ツール

Dockerは、アプリケーションの動作環境をコンテナとして管理するために採用しました。Dockerを使用することで、**アプリケーションの環境構築や依存関係の管理が容易**になり、異なる環境間での動作の一貫性が確保されます。特に、開発環境と本番環境を同一のコンテナイメージで構築できるため、本番環境での「動かない」問題を減らし、デプロイの信頼性が向上します。  
また、Dockerはマイクロサービスアーキテクチャにも対応しやすく、**複数のサービスを効率的に管理**できる点も利点です。従来の仮想マシンと比較して、Dockerは軽量で、リソース効率が良いため、スピードと柔軟性が求められる開発プロジェクトに最適です。
チームメンバー間で統一された開発環境を容易に共有できるため、実務での開発効率が大幅に向上することを意識して採用しました。


## ディレクトリ構成

本プロジェクトのディレクトリ構成は、保守性と拡張性を重視し、アトミックデザインの概念に基づいて設計されています。
Reactのディレクトリ構成には厳密な規定がないため、開発における一貫性を保つためにアトミックデザインの考え方を採用しました。
アトミックデザインは、コンポーネントを「再利用可能なUIの部品」として階層的に構成するため、長期的なメンテナンスや機能の拡張がしやすいという利点があります。
また、コンポーネント単位での開発が容易になることで、開発スピードの向上にも寄与しています。

```plaintext
src/
├── App.tsx             # アプリのメインコンポーネント
├── components/         # UIコンポーネント（アトミックデザインに基づく構成）
│   ├── atoms/          # 最小単位のコンポーネント（ボタン、入力フィールドなど）
│   ├── ecosystems/     # より高度な機能を組み合わせた複合コンポーネント
│   ├── environments/   # コンポーネントの特定環境設定やデザインの切り替え
│   ├── molecules/      # Atomsを組み合わせたやや複雑なコンポーネント（入力フォームなど）
│   ├── organisms/      # Moleculesを組み合わせた機能単位のコンポーネント（ナビゲーションバーなど）
│   └── templates/      # ページ構成に使うテンプレート（ページの枠組みなど）
├── features/           # アプリケーションの特定の機能を構成
│   ├── auth/           # 認証に関する機能（ログイン・ログアウト処理など）
│   └── hooks/          # 特定の機能に関連するカスタムフック
├── main.tsx            # アプリのエントリーポイント
├── routes/             # ルーティング関連の設定
├── urls/               # APIやリンクのURL管理
└── utils/              # ユーティリティ関数やAPIリクエスト関連
```

components フォルダでは、アトミックデザインをベースにコンポーネントを階層的に管理しています。

features フォルダは、特定の機能に関連するコードを集約するためのフォルダです。
認証機能 (auth) など、アプリケーション内で役割が明確な機能ごとに分けることで、コードの分かりやすさと再利用性を高めています。

utils は、APIリクエストや共通の関数をまとめたフォルダです。
汎用的なコードをここに配置することで、他のフォルダからも容易に利用できるようにしています。

urls フォルダにはAPIのエンドポイントやルートのURLを一元管理しています。
これにより、APIの変更に伴う修正を一箇所で行うことが可能となり、メンテナンス性が向上しています。

この構成により、アトミックデザインのメリットを最大限に活かしつつ、機能ごとに整理されたフォルダ構成で効率的な開発環境を実現しています。
将来的に機能が増加しても、再利用性や拡張性の面で柔軟に対応できるような設計を心掛けています。

## 画面

### ホーム
![ホーム](./front/public/images/home.png)

### ログイン
- 入力時バリデーション
![ログイン入力時バリデーション](./front/public/images/login_input.png)
- 送信時バリデーション
![ログイン送信時バリデーション](./front/public/images/login_submit.png)

### ユーザー登録
- 入力時バリデーション
![登録入力時バリデーション](./front/public/images/registration_input.png)
- 送信時バリデーション

### メールアドレス認証
- 認証確認通知
![認証確認通知](./front/public/images/certification.png)
- 認証用メール
![認証確認通知](./front/public/images/certification_mail.png)
- 再送信
![再送信](./front/public/images/resubmit_submit.png)

### パスワードリセット
- 再設定リクエスト
![再設定リクエスト](./front/public/images/reset_submit.png)
- 再設定用メール
![再設定用メール](./front/public/images/reset_mail.png)

- 再設定画面

### ゲストログイン
![ゲストログイン](./front/public/images/guestlogin.gif)

### ボードCRUD
![ボードCURD](./front/public/images/board.gif)

### タスクCRUD
![タスクCURD](./front/public/images/task.gif)

### 検索
![検索](./front/public/images/search.gif)

### 絞り込み
![絞り込み](./front/public/images/narrowdown.gif)

### 並び替え
![並び替え](./front/public/images/sort.gif)




