import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 認証保護コンポーネント：未ログインの場合はログイン画面へリダイレクト
function AuthGuard({ children }) {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AuthGuard
