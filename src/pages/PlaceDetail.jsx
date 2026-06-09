import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBack, IoWalkOutline, IoTimeOutline, IoStarSharp, IoLocationSharp, IoStorefrontOutline } from 'react-icons/io5'
import { fetchPlaceDetail } from '../api/agent'

export default function PlaceDetail() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const [place, setPlace] = useState(JSON.parse(sessionStorage.getItem('selectedPlace') || '{}'))
  const [isLoading, setIsLoading] = useState(false)

  const session = JSON.parse(sessionStorage.getItem('session') || '{}')
  const waitingTime = session.waitingTime || 40

  const [remaining] = useState(() => {
    const elapsed = session?.startedAt ? Math.floor((Date.now() - session.startedAt) / 1000 / 60) : 0
    return Math.max(waitingTime - elapsed, 0)
  })

  // 전체 목록에서 진입한 경우 상세 API 호출
  useEffect(() => {
    const load = async () => {
      if (!place.google_place_id || place.address) return // 이미 상세 데이터 있으면 스킵
      setIsLoading(true)
      try {
        const result = await fetchPlaceDetail(place.google_place_id)
        if (result.status === 'success' && result.places?.[0]) {
          setPlace(result.places[0])
        }
      } catch {
        // 상세 로딩 실패해도 기존 데이터로 표시
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // 카카오맵 렌더링
  useEffect(() => {
    if (!place.latitude || !place.longitude) return

    const loadMap = () => {
      const container = mapRef.current
      if (!container) return
      const options = {
        center: new window.kakao.maps.LatLng(place.latitude, place.longitude),
        level: 3,
      }
      const map = new window.kakao.maps.Map(container, options)
      new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(place.latitude, place.longitude),
      })
    }

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(loadMap)
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com/v2/maps"]')
      if (script) script.addEventListener('load', () => window.kakao.maps.load(loadMap))
    }
  }, [place.latitude, place.longitude])

  const budgetPercent = Math.min((place.total_time / remaining) * 100, 100)

  const handleGo = () => navigate('/timer')

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: 'linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}
      >
        <div className="text-4xl animate-spin">✦</div>
        <p className="text-base font-semibold" style={{ color: '#A8978A' }}>장소 정보를 불러오고 있어요...</p>
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
        <span className="text-base font-bold" style={{ color: '#1C1917', letterSpacing: '-0.3px' }}>장소 상세</span>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-8">

        {/* 지도 */}
        <div
          ref={mapRef}
          className="w-full rounded-2xl overflow-hidden"
          style={{ height: '180px', background: 'linear-gradient(135deg, #F5E8D0, #EDD9B8)', boxShadow: '0 2px 12px rgba(160,130,90,0.10)' }}
        />

        {/* 장소 기본 정보 */}
        <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(160,130,90,0.08)' }}>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: '#F5F0E8', color: '#A07840' }}>
            <IoStorefrontOutline size={11} color="#C9A96E" />
            {place.category || '장소'}
          </div>

          <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1C1917', letterSpacing: '-0.6px' }}>
            {place.name || '장소명'}
          </h2>

          <div className="flex items-center gap-1 mb-4">
            <IoStarSharp size={13} color="#C9A96E" />
            <span className="text-sm font-bold" style={{ color: '#1C1917' }}>{place.rating}</span>
            <span className="text-xs" style={{ color: '#B0A090' }}>리뷰 {place.review_count}</span>
          </div>

          <div className="mb-4" style={{ height: '1px', background: '#F0EAE0' }} />

          <div className="flex flex-col gap-3.5">
            {place.open_hours && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F5F0E8' }}>
                  <IoTimeOutline size={15} color="#C9A96E" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#B0A090' }}>영업시간</p>
                  <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{place.open_hours}</p>
                </div>
              </div>
            )}

            {place.address && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F5F0E8' }}>
                  <IoLocationSharp size={15} color="#C9A96E" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#B0A090' }}>주소</p>
                  <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{place.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F5F0E8' }}>
                <IoWalkOutline size={15} color="#C9A96E" />
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#B0A090' }}>이동시간</p>
                <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>
                  도보 {place.walking_time}분 · 왕복 {(place.walking_time || 0) * 2}분 소요
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F5F0E8' }}>
                <IoTimeOutline size={15} color="#C9A96E" />
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#B0A090' }}>머무는시간</p>
                <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>약 {place.stay_time}분 권장</p>
              </div>
            </div>
          </div>
        </div>

        {/* 시간 예산 */}
        <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(160,130,90,0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wide uppercase" style={{ color: '#B0A090' }}>예상 사용 시간</span>
            <span className="text-sm font-bold" style={{ color: '#A07840' }}>
              {place.total_time}분 / 남은 {remaining}분
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: '#EDE4D8' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${budgetPercent}%`, background: 'linear-gradient(90deg, #C9A96E, #A07840)' }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A96E' }} />
            <p className="text-xs font-medium" style={{ color: '#C4B8A8' }}>
              안전 마진 {remaining - (place.total_time || 0)}분
            </p>
          </div>
        </div>

        {/* 출발 버튼 */}
        <button
          onClick={handleGo}
          className="w-full rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2C2416, #3D3020)', boxShadow: '0 6px 24px rgba(44,36,22,0.25)', padding: '18px' }}
        >
          ▶ 여기로 출발
        </button>

      </div>
    </div>
  )
}