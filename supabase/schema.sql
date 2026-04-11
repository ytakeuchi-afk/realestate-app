-- =====================================================
-- 不動産管理アプリ: データベーススキーマ
-- Supabase SQL Editor に貼り付けて実行してください
-- =====================================================

-- -----------------------------------------------------
-- 物件テーブルの作成
-- -----------------------------------------------------
CREATE TABLE properties (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       TEXT        NOT NULL,             -- 物件名
  rent       INTEGER     NOT NULL,             -- 月額家賃（円）
  area       TEXT        NOT NULL,             -- エリア名（例：東京都新宿区）
  type       TEXT        NOT NULL,             -- 間取り（例：1LDK）
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -----------------------------------------------------
-- Row Level Security（行レベルセキュリティ）の有効化
-- 有効にすることで、ポリシーなしには一切のアクセスを拒否
-- -----------------------------------------------------
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- RLS ポリシー: 自分が登録した物件のみ操作できる
-- -----------------------------------------------------

-- SELECT: 自分の物件のみ一覧表示できる
CREATE POLICY "ユーザーは自分の物件のみ参照できる"
  ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: user_id が自分のIDと一致する場合のみ登録できる
CREATE POLICY "ユーザーは自分の物件のみ登録できる"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分の物件のみ更新できる
CREATE POLICY "ユーザーは自分の物件のみ更新できる"
  ON properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分の物件のみ削除できる
CREATE POLICY "ユーザーは自分の物件のみ削除できる"
  ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
