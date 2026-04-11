import { createContext, useContext } from 'react'

// 認証情報を共有するコンテキスト
export const AuthContext = createContext(null)

// 認証コンテキストを参照するカスタムフック
export const useAuth = () => useContext(AuthContext)
