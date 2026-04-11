import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { AuthContext } from './contexts/AuthContext'
import AuthGuard from './components/AuthGuard'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

function App() {
  // undefined = 認証状態の読み込み中、null = 未ログイン、object = ログイン済み
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初回レンダリング時に現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 認証状態の変化（ログイン・ログアウト）を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // コンポーネントアンマウント時にリスナーを解除
    return () => subscription.unsubscribe()
  }, [])

  // 認証状態の読み込み中は何も表示しない（ちらつき防止）
  if (session === undefined) {
    return null
  }

  return (
    // 認証情報をアプリ全体に提供
    <AuthContext.Provider value={{ session }}>
      <BrowserRouter>
        <Routes>
          {/* ログインページ */}
          <Route path="/login" element={<Login />} />
          {/* 会員登録ページ */}
          <Route path="/register" element={<Register />} />
          {/* 物件一覧（ログイン必須） */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Properties />
              </AuthGuard>
            }
          />
          {/* 未定義パスはトップへリダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
