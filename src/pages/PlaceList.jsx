import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBack, IoWalkOutline, IoTimeOutline, IoStarSharp } from 'react-icons/io5'
import { fetchPlaceList } from '../api/agent'

const CATEGORIES = ['전체', '카페', '쇼핑', '문화', '산책', '놀거리']

const CATEGORY_ICONS = {
  '전체': '🗺️',
  '카페': '☕',
  '쇼핑': '🛍️',
  '문화': '🎨',
  '산책': '🌳',
  '놀거리': '🎮',
}

export default function PlaceList() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [places, setPlaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const session = JSON.parse(sessionStorage.getItem('session') || '{}')
  const waitingTime = session.waitingTime || 40
  const preference = JSON.parse(localStorage.getItem('preference') || '{}')
  const preferenceStr = Object.values(preference).join(', ')

  const [remaining] = useState(() => {
    const elapsed = session?.startedAt ? Math.floor((Date.now() - session.startedAt) / 1000 / 60) : 0
    return Math.max(waitingTime - elapsed, 0)
  })

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await fetchPlaceList({
          waiting_place: session.waitingPlace || '',
          latitude: session.latitude,
          longitude: session.longitude,
          waiting_time: remaining,
          companion: session.companion || '혼자',
          preference: preferenceStr,
          avoid: '',
          current_datetime: new Date().toISOString(),
        })

        if (result.status === 'fail') {
          setError(result.fail_reason || '주변 장소를 찾지 못했어요.')
        } else {
          setPlaces(result.places || [])
        }
      } catch {
        setError('목록을 불러오는 데 실패했어요.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filtered = activeCategory === '전체'
    ? places
    : places.filter(p => p.category === activeCategory)

  const handleSelect = (place) => {
    sessionStorage.setItem('selectedPlace', JSON.stringify(place))
    navigate('/detail')
  }

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}
      >
        <div className="text-4xl animate-spin">✦</div>
        <p className="text-base font-semibold" style={{ color: '#A8978A' }}>주변 장소를 찾고 있어요...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center gap-5 px-8"
        style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif", maxWidth: '390px', margin: '0 auto' }}
      >
        <div className="text-4xl">😔</div>
        <p className="text-base font-semibold text-center" style={{ color: '#6B5A47' }}>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 rounded-2xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #2C2416, #3D3020)' }}
        >
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif", maxWidth: '390px', margin: '0 auto' }}
    >
      {/* 상단 네비 */}
      <div className="flex items-center justify-center relative px-5 pt-14 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <IoChevronBack size={18} color="#1C1917" />
        </button>
        <span className="text-base font-bold" style={{ color: '#1C1917', letterSpacing: '-0.3px' }}>전체 목록</span>
      </div>

      {/* 서브타이틀 */}
      <div className="px-5 mb-4">
        <p className="text-sm font-semibold" style={{ color: '#A8978A' }}>
          남은 <span className="font-bold" style={{ color: '#1C1917' }}>{remaining}분</span> 안에 다녀올 수 있는 곳{' '}
          <span className="font-bold" style={{ color: '#C9A96E' }}>{filtered.length}곳</span>
        </p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150"
            style={{
              background: activeCategory === cat ? '#1C1917' : 'rgba(255,255,255,0.85)',
              color: activeCategory === cat ? '#FFFFFF' : '#6B5A47',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* 장소 리스트 */}
      <div className="flex flex-col gap-3 px-5 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-3xl">🔍</div>
            <p className="text-sm font-semibold" style={{ color: '#B0A090' }}>해당 카테고리 장소가 없어요</p>
          </div>
        ) : (
          filtered.map((place, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(place)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(160,130,90,0.08)', border: 'none' }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #F5E8D0, #EDD9B8)' }}
              >
                {place.image_url ? (
                  <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="opacity-50">{CATEGORY_ICONS[place.category] || '📍'}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-bold truncate" style={{ color: '#1C1917', letterSpacing: '-0.3px' }}>
                    {place.name}
                  </span>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <IoStarSharp size={11} color="#C9A96E" />
                    <span className="text-xs font-bold" style={{ color: '#1C1917' }}>{place.rating}</span>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: '#B0A090' }}>{place.category}</p>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#A07840' }}>
                    <IoWalkOutline size={11} color="#C9A96E" />
                    {place.walking_time}분
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#A07840' }}>
                    <IoTimeOutline size={11} color="#C9A96E" />
                    {place.stay_time}분
                  </div>
                </div>
              </div>

              <IoChevronBack size={14} color="#C4B8A8" style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
            </button>
          ))
        )}
      </div>
    </div>
  )
}