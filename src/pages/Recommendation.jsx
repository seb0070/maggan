import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoTimeOutline, IoWalkOutline, IoStarSharp, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { fetchRecommendation } from '../api/agent'

export default function Recommendation() {
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avoid, setAvoid] = useState([])

  const session = JSON.parse(sessionStorage.getItem('session') || '{}')
  const waitingTime = session.waitingTime || 40
  const preference = JSON.parse(localStorage.getItem('preference') || '{}')
  const preferenceStr = Object.values(preference).join(', ')

  const [remaining] = useState(() => {
    const elapsed = session?.startedAt ? Math.floor((Date.now() - session.startedAt) / 1000 / 60) : 0
    return Math.max(waitingTime - elapsed, 0)
  })

  const fetchPlace = async (avoidList) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchRecommendation({
        waiting_place: session.waitingPlace || '',
        latitude: session.latitude,
        longitude: session.longitude,
        waiting_time: remaining,
        companion: session.companion || '혼자',
        preference: preferenceStr,
        avoid: avoidList.join(', '),
        current_datetime: new Date().toISOString(),
      })

      if (result.status === 'fail') {
        setError(result.fail_reason || '추천할 수 있는 장소를 찾지 못했어요.')
        setPlace(null)
      } else {
        setPlace(result.places?.[0] || null)
      }
    } catch {
      setError('추천을 불러오는 데 실패했어요. 다시 시도해줘요.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchPlace([])
    }
    load()
  }, [])

  const handleOther = () => {
    const newAvoid = place ? [...avoid, place.name] : avoid
    setAvoid(newAvoid)
    fetchPlace(newAvoid)
  }

  const handleList = () => navigate('/list')

  const handleGo = () => {
    sessionStorage.setItem('selectedPlace', JSON.stringify(place))
    navigate('/detail')
  }

  const budgetPercent = place ? Math.min((place.total_time / remaining) * 100, 100) : 0

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}
      >
        <div className="text-4xl animate-spin">✦</div>
        <p className="text-base font-semibold" style={{ color: '#A8978A' }}>막간을 찾고 있어요...</p>
      </div>
    )
  }

  if (error || !place) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center gap-5 px-8"
        style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif", maxWidth: '390px', margin: '0 auto' }}
      >
        <div className="text-4xl">😔</div>
        <p className="text-base font-semibold text-center" style={{ color: '#6B5A47' }}>
          {error || '추천할 장소를 찾지 못했어요.'}
        </p>
        <button
          onClick={() => navigate('/home')}
          className="px-8 py-4 rounded-2xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #2C2416, #3D3020)' }}
        >
          홈으로 돌아가기
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
                  {place.total_time}분 / {remaining}분
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