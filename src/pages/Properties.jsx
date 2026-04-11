import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/properties.module.css'

// ダミー物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンシャインマンション 301', rent: 85000, area: '東京都新宿区西新宿', type: '1LDK', size: 42.5 },
  { id: 2, name: 'グリーンパレス 502', rent: 68000, area: '東京都渋谷区代々木', type: '1K', size: 28.3 },
  { id: 3, name: 'リバーサイドコート 201', rent: 95000, area: '神奈川県横浜市中区', type: '2LDK', size: 58.2 },
  { id: 4, name: 'ブルースカイアパート 105', rent: 52000, area: '埼玉県さいたま市大宮区', type: '1K', size: 25.0 },
  { id: 5, name: 'ミドリヒルズ 403', rent: 75000, area: '千葉県千葉市美浜区', type: '1LDK', size: 38.7 },
  { id: 6, name: 'スターライトレジデンス 1001', rent: 120000, area: '東京都港区六本木', type: '2LDK', size: 62.0 },
  { id: 7, name: 'シーブリーズマンション 205', rent: 62000, area: '神奈川県横須賀市', type: '1K', size: 30.1 },
  { id: 8, name: 'メープルコート 308', rent: 88000, area: '東京都世田谷区三軒茶屋', type: '2DK', size: 48.5 },
]

// 家賃を日本円形式にフォーマット（例：85,000）
const formatRent = (amount) => new Intl.NumberFormat('ja-JP').format(amount)

// 物件一覧ページ
function Properties() {
  const { session } = useAuth()
  const navigate = useNavigate()

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
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
        <div className={styles.header}>
          <h1 className={styles.heading}>物件一覧</h1>
          <span className={styles.count}>{DUMMY_PROPERTIES.length}件</span>
        </div>

        {/* 物件カードグリッド */}
        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.propertyType}>{property.type}</span>
              </div>
              <h2 className={styles.propertyName}>{property.name}</h2>
              <div className={styles.propertyInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>📍</span>
                  <span className={styles.infoText}>{property.area}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>📐</span>
                  <span className={styles.infoText}>{property.size}㎡</span>
                </div>
              </div>
              <div className={styles.rentRow}>
                <span className={styles.rentLabel}>月額家賃</span>
                <span className={styles.rent}>¥{formatRent(property.rent)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Properties
