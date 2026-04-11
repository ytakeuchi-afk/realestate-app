import { createClient } from '@supabase/supabase-js'

// 環境変数からSupabase接続情報を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabaseクライアントを生成してエクスポート
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
