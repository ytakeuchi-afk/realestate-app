import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from '../styles/auth.module.css'

// 会員登録ページ
function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // 会員登録ボタン押下時の処理
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // パスワード一致チェック
    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    // パスワード文字数チェック
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('登録に失敗しました。入力内容を確認してください。')
    } else {
      // 登録後は確認メール送信の案内を表示
      setMessage('確認メールを送信しました。メールを確認してログインしてください。')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>🏠</div>
        <h1 className={styles.title}>不動産管理システム</h1>
        <h2 className={styles.subtitle}>新規会員登録</h2>
        <form onSubmit={handleRegister} className={styles.form}>
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
            <label className={styles.label}>パスワード（6文字以上）</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワードを入力"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>パスワード（確認）</label>
            <input
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="パスワードを再入力"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
        <p className={styles.linkText}>
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login" className={styles.link}>ログイン</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
