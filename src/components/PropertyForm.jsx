import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/propertyForm.module.css'

// 間取りの選択肢
const TYPE_OPTIONS = ['ワンルーム', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK', '4LDK以上']

/**
 * 物件の新規登録・編集フォームモーダル
 * property が null → 新規登録モード
 * property に値あり → 編集モード
 */
function PropertyForm({ property, onSave, onCancel }) {
  const { session } = useAuth()
  const isEdit = !!property

  // フォームの初期値：編集時は既存データをセット
  const [form, setForm] = useState({
    name: property?.name ?? '',
    rent: property?.rent ?? '',
    area: property?.area ?? '',
    type: property?.type ?? '1LDK',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 入力値の更新
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // フォーム送信（INSERT または UPDATE）
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // バリデーション
    const rent = parseInt(form.rent, 10)
    if (isNaN(rent) || rent <= 0) {
      setError('家賃は1以上の整数を入力してください')
      return
    }

    setLoading(true)

    const payload = {
      name: form.name.trim(),
      rent,
      area: form.area.trim(),
      type: form.type,
    }

    let queryError

    if (isEdit) {
      // 既存物件の更新（RLSにより自分の物件のみ更新可能）
      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', property.id)
      queryError = error
    } else {
      // 新規物件の登録（user_idに自分のIDをセット）
      const { error } = await supabase
        .from('properties')
        .insert({ ...payload, user_id: session.user.id })
      queryError = error
    }

    if (queryError) {
      setError('保存に失敗しました。もう一度お試しください。')
    } else {
      onSave()
    }
    setLoading(false)
  }

  return (
    // モーダルの背景オーバーレイ
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        // モーダル内クリックが背景に伝播しないようにする
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>
          {isEdit ? '物件を編集' : '物件を新規登録'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 物件名 */}
          <div className={styles.field}>
            <label className={styles.label}>物件名</label>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="例：サンシャインマンション 301"
            />
          </div>

          {/* 月額家賃 */}
          <div className={styles.field}>
            <label className={styles.label}>月額家賃（円）</label>
            <input
              className={styles.input}
              type="number"
              name="rent"
              value={form.rent}
              onChange={handleChange}
              required
              min="1"
              placeholder="例：85000"
            />
          </div>

          {/* エリア名 */}
          <div className={styles.field}>
            <label className={styles.label}>エリア名</label>
            <input
              className={styles.input}
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              required
              placeholder="例：東京都新宿区西新宿"
            />
          </div>

          {/* 間取り */}
          <div className={styles.field}>
            <label className={styles.label}>間取り</label>
            <select
              className={styles.input}
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* エラーメッセージ */}
          {error && <p className={styles.error}>{error}</p>}

          {/* アクションボタン */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm
