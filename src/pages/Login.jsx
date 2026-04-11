import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from '../styles/auth.module.css'

// ログインページ
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ログインボタン押下時の処理
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // エラーメッセージを日本語に変換
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>🏠</div>
        <h1 className={styles.title}>不動産管理システム</h1>
        <h2 className={styles.subtitle}>ログイン</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>メールアドレス</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>パスワード</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワードを入力"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <p className={styles.linkText}>
          アカウントをお持ちでない方は{' '}
          <Link to="/register" className={styles.link}>新規登録</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
