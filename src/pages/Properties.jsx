import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import styles from '../styles/properties.module.css'

// 家賃を日本円形式にフォーマット（例：85,000）
const formatRent = (amount) => new Intl.NumberFormat('ja-JP').format(amount)

// 物件一覧ページ（CRUD対応）
function Properties() {
  const { session } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // フォームモーダルの表示制御
  const [showForm, setShowForm] = useState(false)
  // 編集対象の物件（null = 新規登録モード）
  const [editingProperty, setEditingProperty] = useState(null)

  // -----------------------------------------------
  // Supabaseから自分の物件一覧を取得（SELECT）
  // -----------------------------------------------
  const fetchProperties = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました。ページを再読み込みしてください。')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 初回マウント時に物件一覧を取得
  useEffect(() => {
    fetchProperties()
  }, [])

  // -----------------------------------------------
  // ログアウト処理
  // -----------------------------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // -----------------------------------------------
  // 新規登録フォームを開く
  // -----------------------------------------------
  const handleAdd = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  // -----------------------------------------------
  // 編集フォームを開く（対象物件のデータをセット）
  // -----------------------------------------------
  const handleEdit = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // -----------------------------------------------
  // 物件削除（DELETE）
  // -----------------------------------------------
  const handleDelete = async (id, name) => {
    // 削除前に確認ダイアログを表示
    if (!window.confirm(`「${name}」を削除しますか？\nこの操作は元に戻せません。`)) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      alert('削除に失敗しました。もう一度お試しください。')
    } else {
      // 再取得せずリストから即時除去してUIを更新
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // -----------------------------------------------
  // フォーム保存後の処理（INSERT / UPDATE 共通）
  // -----------------------------------------------
  const handleFormSave = () => {
    setShowForm(false)
    setEditingProperty(null)
    // Supabaseから最新データを再取得してリストを更新
    fetchProperties()
  }

  // フォームのキャンセル
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  return (
    <div className={styles.page}>
      {/* ナビゲーションバー */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.navBrand}>
            <span className={styles.navLogo}>🏠</span>
            <span className={styles.navTitle}>不動産管理システム</span>
          </div>
          <div className={styles.navRight}>
            <span className={styles.userEmail}>{session?.user?.email}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        {/* ページヘッダー：タイトルと新規登録ボタン */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.heading}>物件一覧</h1>
            {!loading && (
              <span className={styles.count}>{properties.length}件</span>
            )}
          </div>
          <button onClick={handleAdd} className={styles.addButton}>
            ＋ 物件を登録
          </button>
        </div>

        {/* 読み込み中 */}
        {loading && <p className={styles.stateText}>読み込み中...</p>}

        {/* エラー表示 */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* 物件が0件の場合のメッセージ */}
        {!loading && !error && properties.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>登録された物件がありません</p>
            <p className={styles.emptyHint}>「＋ 物件を登録」から最初の物件を追加してください</p>
          </div>
        )}

        {/* 物件カードグリッド */}
        {!loading && properties.length > 0 && (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                {/* 間取りバッジ */}
                <div className={styles.cardHeader}>
                  <span className={styles.propertyType}>{property.type}</span>
                </div>

                {/* 物件名 */}
                <h2 className={styles.propertyName}>{property.name}</h2>

                {/* エリア・面積情報 */}
                <div className={styles.propertyInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoIcon}>📍</span>
                    <span className={styles.infoText}>{property.area}</span>
                  </div>
                </div>

                {/* 家賃表示 */}
                <div className={styles.rentRow}>
                  <span className={styles.rentLabel}>月額家賃</span>
                  <span className={styles.rent}>¥{formatRent(property.rent)}</span>
                </div>

                {/* 編集・削除ボタン */}
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEdit(property)}
                    className={styles.editButton}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(property.id, property.name)}
                    className={styles.deleteButton}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 物件登録・編集モーダル（表示中のみレンダリング） */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}

export default Properties
