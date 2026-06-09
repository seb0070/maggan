import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoTimeOutline, IoWalkOutline, IoStarSharp, IoChevronBack, IoChevronForward } from 'react-icons/io5'

const MOCK_PLACES = [
  {
    name: '엽서가게 살림',
    category: '소품샵',
    walking_time: 5,
    stay_time: 20,
    total_time: 30,
    rating: 4.3,
    review_count: 128,
    image_url: null,
    reason: '조용한 실내 소품샵으로 혼자 둘러보기 좋아요. 도보 5분 거리라 여유있게 다녀올 수 있어요.',
  },
  {
    name: '카페 모자이크',
    category: '카페',
    walking_time: 4,
    stay_time: 25,
    total_time: 33,
    rating: 4.5,
    review_count: 342,
    image_url: null,
    reason: '구경·놀거리 후보가 부족해 안전한 대체 장소로 추천드려요. 레몬 타르트가 유명한 조용한 카페예요.',
  },
  {
    name: '연남 작은 공원',
    category: '공원',
    walking_time: 7,
    stay_time: 15,
    total_time: 29,
    rating: 4.1,
    review_count: 89,
    image_url: null,
    reason: '날씨가 맑아서 잠깐 바람 쐬기 좋은 조용한 공원이에요.',
  },
]

export default function Recommendation() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const session = JSON.parse(sessionStorage.getItem('session') || '{}')
  const place = MOCK_PLACES[currentIndex]
  const waitingTime = session.waitingTime || 40

  // 남은 시간 계산
const [elapsed] = useState(() => {
  return session?.startedAt ? Math.floor((Date.now() - session.startedAt) / 1000 / 60) : 0
})
  const remaining = Math.max(waitingTime - elapsed, 0)

  const handleOther = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_PLACES.length)
      setIsLoading(false)
    }, 1200)
  }

  const handleList = () => navigate('/list')

  const handleGo = () => {
    sessionStorage.setItem('selectedPlace', JSON.stringify(place))
    navigate('/detail')
  }

  const budgetPercent = Math.min((place.total_time / waitingTime) * 100, 100)

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}
      >
        <div className="text-4xl animate-spin">✦</div>
        <p className="text-base font-semibold" style={{ color: '#A8978A' }}>다른 곳을 찾고 있어요...</p>
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
          onClick={() => navigate('/home')}
          className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <IoChevronBack size={18} color="#1C1917" />
        </button>
        <span className="text-base font-bold" style={{ color: '#1C1917', letterSpacing: '-0.3px' }}>막간 추천</span>
      </div>

      <div className="flex flex-col flex-1 px-5 pb-8 gap-4">

        {/* 타이머 인라인 카드 */}
        <button
          onClick={() => navigate('/timer')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FDF0DC, #F5E4C0)' }}>
            <IoTimeOutline size={16} color="#C9A96E" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#B0A090' }}>
              {session.waitingPlace || '웨이팅 중'}까지
            </p>
            <p className="text-sm font-bold" style={{ color: '#1C1917', letterSpacing: '-0.3px' }}>
              {String(remaining).padStart(2, '0')}:{String(0).padStart(2, '0')} 남음
            </p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#F5EFE8', color: '#A07840' }}>
            타이머
            <IoChevronForward size={11} color="#C9A96E" />
          </div>
        </button>

        {/* 섹션 라벨 */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{ color: '#C9A96E' }}>
          <div className="w-4 h-0.5 rounded-full" style={{ background: '#C9A96E' }} />
          오늘의 추천
        </div>

        {/* 추천 카드 */}
        <div className="rounded-3xl overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 4px 24px rgba(160,130,90,0.12)' }}>

          {/* 이미지 */}
          <div className="w-full h-44 relative flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5E8D0, #EDD9B8)' }}>
            {place.image_url ? (
              <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl opacity-40">🏙️</span>
            )}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.92)', color: '#A07840', backdropFilter: 'blur(8px)' }}>
              {place.category}
            </div>
          </div>

          {/* 카드 바디 */}
          <div className="p-5 flex flex-col gap-3">

            {/* 장소명 + 별점 */}
            <div className="flex items-start justify-between gap-2">
              <div className="text-xl font-extrabold" style={{ color: '#1C1917', letterSpacing: '-0.5px' }}>
                {place.name}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                <IoStarSharp size={12} color="#C9A96E" />
                <span className="text-sm font-bold" style={{ color: '#1C1917' }}>{place.rating}</span>
                <span className="text-xs" style={{ color: '#B0A090' }}>리뷰 {place.review_count}</span>
              </div>
            </div>

            {/* 시간 칩 */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: '#F5F0E8', color: '#6B5A47' }}>
                <IoWalkOutline size={13} color="#C9A96E" />
                도보 {place.walking_time}분
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: '#F5F0E8', color: '#6B5A47' }}>
                <IoTimeOutline size={13} color="#C9A96E" />
                머무는 {place.stay_time}분
              </div>
            </div>

            {/* 추천 이유 */}
            <div className="flex gap-2.5 items-start">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FDF0DC, #F5E4C0)' }}>
                ✦
              </div>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#6B5A47' }}>
                {place.reason}
              </p>
            </div>

            {/* 시간 예산 */}
            <div className="rounded-xl p-3" style={{ background: '#FAF6EF' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: '#B0A090' }}>시간 예산</span>
                <span className="text-xs font-bold" style={{ color: '#A07840' }}>
                  {place.total_time}분 / {waitingTime}분
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: '#EDE4D8' }}>
                <div className="h-full rounded-full" style={{ width: `${budgetPercent}%`, background: 'linear-gradient(90deg, #C9A96E, #A07840)' }} />
              </div>
              <p className="text-xs" style={{ color: '#C4B8A8' }}>
                왕복 {place.walking_time * 2}분 + 머무는 {place.stay_time}분
              </p>
            </div>

          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleGo}
            className="w-full rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            style={{ background: 'linear-gradient(135deg, #2C2416, #3D3020)', boxShadow: '0 6px 24px rgba(44,36,22,0.25)', padding: '18px' }}
          >
            ♡ 좋아, 여기로 갈게요
          </button>
          <div className="flex gap-2.5">
            <button
              onClick={handleOther}
              className="flex-1 rounded-2xl text-sm font-semibold active:scale-[0.97] transition-transform"
              style={{ background: 'rgba(255,255,255,0.85)', color: '#6B5A47', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', backdropFilter: 'blur(8px)', padding: '15px' }}
            >
              ↺ 다른 거 보여줘
            </button>
            <button
              onClick={handleList}
              className="flex-1 rounded-2xl text-sm font-semibold active:scale-[0.97] transition-transform"
              style={{ background: 'rgba(255,255,255,0.85)', color: '#6B5A47', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', backdropFilter: 'blur(8px)', padding: '15px' }}
            >
              ≡ 내가 고를게
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}