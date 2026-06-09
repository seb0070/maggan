import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBack, IoWalkOutline, IoTimeOutline, IoStarSharp } from 'react-icons/io5'

const MOCK_PLACES = [
  { name: '엽서가게 살림', category: '소품샵', walking_time: 5, stay_time: 20, total_time: 30, rating: 4.3, review_count: 128, image_url: null },
  { name: '카페 모자이크', category: '카페', walking_time: 4, stay_time: 25, total_time: 33, rating: 4.5, review_count: 342, image_url: null },
  { name: '연남 작은 공원', category: '공원', walking_time: 7, stay_time: 15, total_time: 29, rating: 4.1, review_count: 89, image_url: null },
  { name: '플레인북스 팝업', category: '팝업스토어', walking_time: 6, stay_time: 20, total_time: 32, rating: 4.6, review_count: 210, image_url: null },
  { name: '동진시장 골목', category: '둘러보기', walking_time: 8, stay_time: 15, total_time: 31, rating: 4.0, review_count: 67, image_url: null },
]

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

  const session = JSON.parse(sessionStorage.getItem('session') || '{}')
  const waitingTime = session.waitingTime || 40

  const filtered = activeCategory === '전체'
    ? MOCK_PLACES
    : MOCK_PLACES.filter(p => p.category === activeCategory)

  const handleSelect = (place) => {
    sessionStorage.setItem('selectedPlace', JSON.stringify(place))
    navigate('/detail')
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
          남은 <span className="font-bold" style={{ color: '#1C1917' }}>{waitingTime}분</span> 안에 다녀올 수 있는 곳{' '}
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
        {filtered.map((place, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(place)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(160,130,90,0.08)', border: 'none' }}
          >
            {/* 썸네일 */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ background: 'linear-gradient(135deg, #F5E8D0, #EDD9B8)' }}
            >
              {place.image_url ? (
                <img src={place.image_url} alt={place.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="opacity-50">{CATEGORY_ICONS[place.category] || '📍'}</span>
              )}
            </div>

            {/* 정보 */}
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

            {/* 화살표 */}
            <IoChevronBack size={14} color="#C4B8A8" style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  )
}