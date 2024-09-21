## 概要

サービス名：<br>
Task Manager（フロントエンド）

ゲスト用 ID（体験版）:<br>
メール　 → 　cnann.0615.test@gmail.com<br>
パスワード　 → 　 testes0615

URL（上記ゲスト用 ID でぜひお使いください）： https://task-manager-frontend-14.vercel.app/

バックエンド リポジトリ：
https://github.com/cnann0615/TaskManager-backend

↓ サービスイメージ ↓
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/17500287-b36a-8f29-99c8-cb93c7f143ba.png)

## きっかけ

日々の仕事の中で、タスク管理に時間をかけてしまっている悩みや、数多くのタスクに気が散り１つの作業に集中できていない悩みを抱えており、その悩みを解決できるようなアプリが欲しい！と思い、開発した。

また、2024 年に入ってから、フロントエンドについて本格的に学び始めた中で、
「Udemy 等でのインプット学習で学んだ知識を、実践レベルで身につけたい！」
という思いを持ったのもきっかけの１つ。

## 開発環境と使用技術

### 開発環境

OS：macOS<br>
IDE：Visual Studio Code

### 使用技術

＜フロントエンド＞<br>
言語：TypeScript<br>
フレームワーク：Next.js<br>
ライブラリ：React, Redux, Axios<br>
スタイル：Tailwind CSS<br>
テスト：JEST, React Testing Library 　 ← 未着手<br>
デプロイ：Vercel<br>
パッケージ管理ツール：npm<br>

＜その他＞<br>
GitHub（ソースコード管理）<br>
Firebase Authentication（認証）<br>
React icons（アイコン）<br>

## 機能概要

ざっくり概要<br>

- 一般的なタスク管理アプリだが、機能面でこだわったポイントは以下 2 点。
  - Today's Must 1 という、その日に最優先で取り組みたいタスクを視覚的に目立たせて表示できる機能を実装した点。
  - 「カテゴリ」「スケジュール」という２軸でフィルターをかけてタスクを表示できる機能を実装した点。
- データの流れは、以下イメージ。<br><br>
  フロントエンド ←→ axios ←→ API サーバ（SpringBoot） ←→ DB(MySQL)
  <br><br>
- フロントエンドでの状態管理は Redux Toolkit（その他 React Hooks）を使用

個々の機能は以下。

### ログイン

ログインには Firebase Authentication を使用。<br>
Googole ログインのみに対応。<br>

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/560054cb-8ea2-ae21-f070-90fd5e2b33b9.png)

### 新規タスク追加

新規タスクの追加はこのフォームから行う。<br>
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/89053edc-2458-7895-be33-e181c53396a9.png)

「Detail ↓」　をクリックすると、詳細を入力するフォームが現れる。<br>
タイトルのみ必須入力<br>
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/244a6b4b-b1e8-70db-e8f9-15de2674ec8c.png)

### 新規カテゴリ / スケジュール追加

カテゴリとスケジュールは、タスクに紐づける情報となる<br>
仕事で Microsoft ToDo を使用しているが、１タスクにつき１リストしか割り当てができず、
「業務の種類」と「いつやるか」の２つの属性を持たせて管理したいとずっと思っていた。<br>

そこで今回、「カテゴリ」と「スケジュール」の２つの属性をタスクにつけられるようにした。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/483e4d2c-6647-615b-3eb0-0c119508214a.png)

追加したカテゴリ/スケジュールは、新規タスク追加フォームのプルダウンにて選択可能。<br>

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/8e5c353d-0aee-9d5b-a749-78e4ed1bd78f.png)

### タスクリストとタスク詳細

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/43cbc430-b8bf-e807-489c-9367ac473ce1.png)

#### タスクリスト

- フォームから追加されたタスクが表示される。

- カテゴリタブ（緑タブ）とスケジュールタブ（紫タブ）を選択でき、
  カテゴリ × スケジュールに当てはまるタスクを表示する仕組みとなっている。
  上のスクショの場合、カテゴリが「Frontend」かつ、スケジュールが「Today」のタスクが表示されている。

- 横幅が狭いため、カテゴリタブは、右上の　「< Tab >ボタン」を使ってページ化。

- 各タブは、名前の編集（鉛筆マーク）、削除（× マーク）が可能。

  - 編集された場合は、対象のタスクのカテゴリ/スケジュールに即時に反映される。
  - 削除した場合は、対象のタスクも全て削除される。

    ![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/0311ccb1-ad4d-e8fa-5c18-bb694c365939.png)

- タスクカード上のチェックボックスをクリックすると完了未完了が入れ替わり、動的にタスクが移動する。
- タスクのタイトルをクリックすると、画面右側のタスク詳細に、詳細が表示される。

##### Today's Must 1

- 全てのタスクの中から、その日に最優先で取り組みたいタスクを選び、目立たせて表示できる機能。この機能により、ユーザは、やるべきタスクを明確にでき、作業に集中できる。
- タスクを Today's Must 1 に設定する方法は、以下のタスク詳細で説明する。
  ![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/1170304e-de4e-034a-ea68-2e71008b6291.png)

#### タスク詳細

- 各項目をクリックすると編集可能になる。
  また、編集した内容は、フォーカスが外れたタイミングで、即座に Redux とバックエンドに反映される。
- 右下の「Delete ボタン」からタスクを削除することができる。
- 右下の「Must1！ボタン」を押下するとそのタスクを上記で説明した Today's Must １のタスクに設定できる。
- メモ欄が大きいのが特徴。以下のようにノート替わりに使用できる。
  ![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3817219/cc006026-d160-2fe6-65e3-f505a4e0ca52.png)

## 苦労した点とその解決策

＜苦労した点＞<br>

- フロントエンドでの状態管理に一番苦労した。<br>
  最初は React の useState や useContext を使用して、各コンポーネント間で状態を共有して開発を進められていたものの、コンポーネントや機能を増やすにつれ、どこで状態が管理され、どこで変更されているのかが分かりにくくなった。<br>
  それと同時に、新機能の追加や、バグ解消にかかる時間も増え、開発効率が落ちてしまった。<br>

＜解決策＞<br>

- 上記の問題を解決するために、Redux を勉強し、Redux Toolkit を導入することにした。<br>
  Redux によって状態管理を一元化することで、全ての状態の流れが明確になった。<br>
  状態管理をしたいデータは、Store および Slice で管理し、コンポーネントからは必要なデータを useSelector で受け取り、変更を dispatch するだけ、という状態をつくった。<br>
  結果として、新たなコンポーネントや新機能を追加する際に、状態管理周辺のことに対して、悩む時間が減り、データ・処理の流れも追いやすくなった。<br>

## 今後やりたいこと

- ドラッグ機能の実装

  - react beautiful dnd を使用したドラッグ機能を実装し、タスクをドラッグすることで、完了未完了を切り替えや、カテゴリやスケジュールを変更できる機能を追加したい。

- テスト
  - JEST, React Testing Library を使用したテストを実施予定。実際のサービスにはテストが不可欠だと思うので、しっかり学習していきたい。

## 最後に

この個人開発を通して、これまでインプットした内容をもとに、自力で実際に動くアプリケーションを作ることができ、とても自信がついた。<br>

開発をする過程で様々なエラーにぶつかり、それを乗り越えることで、エンジニアとしてのレベルが上がっていくのを、身をもって体験することができた。<br>

今後もアウトプットをたくさんし、技術レベルを上げていきたい。<br>

---
