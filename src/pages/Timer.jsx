import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBack, IoNavigateOutline } from 'react-icons/io5'

export default function Timer() {
  const navigate = useNavigate()
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [totalSeconds, setTotalSeconds] = useState(null)
  const [returnTime, setReturnTime] = useState({ hour: '--', min: '--' })

  const session = JSON.parse(sessionStorage.getItem('session') || '{}')
  const place = JSON.parse(sessionStorage.getItem('selectedPlace') || '{}')

  useEffect(() => {
    if (!session.startedAt || !session.waitingTime) return
    const total = session.waitingTime * 60

    const tick = () => {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
      const remaining = Math.max(total - elapsed, 0)
      setTotalSeconds(total)
      setRemainingSeconds(remaining)
      const rt = new Date(Date.now() + remaining * 1000)
      setReturnTime({
        hour: String(rt.getHours()).padStart(2, '0'),
        min: String(rt.getMinutes()).padStart(2, '0'),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDirections = () => {
    if (place.latitude && place.longitude) {
      window.open(`kakaomap://look?p=${place.latitude},${place.longitude}`)
      setTimeout(() => {
        window.open(`https://map.kakao.com/link/to/${place.name},${place.latitude},${place.longitude}`)
      }, 500)
    }
  }

  const handleOther = () => navigate('/recommendation')

  if (remainingSeconds === null) return null

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const progress = totalSeconds ? remainingSeconds / totalSeconds : 1
  const isUrgent = remainingSeconds < 300

  const radius = 100
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

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
        <span className="text-base font-bold" style={{ color: '#1C1917', letterSpacing: '-0.3px' }}>막간 타이머</span>
      </div>

      {/* 장소명 */}
      {place.name && (
        <div className="flex flex-col items-center px-5 mb-8">
          <p className="text-xs font-semibold mb-1" style={{ color: '#B0A090' }}>지금 향하는 곳</p>
          <h2 className="text-xl font-extrabold text-center" style={{ color: '#1C1917', letterSpacing: '-0.5px' }}>
            {place.name}
          </h2>
        </div>
      )}

      {/* 원형 타이머 */}
      <div className="flex items-center justify-center flex-1 px-5">
        <div className="relative flex items-center justify-center">
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle
              cx="130" cy="130" r={radius}
              fill="none"
              stroke="#EDE4D8"
              strokeWidth="14"
            />
            <circle
              cx="130" cy="130" r={radius}
              fill="none"
              stroke={isUrgent ? '#E74C3C' : '#C9A96E'}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 130 130)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <p className="text-xs font-semibold mb-1" style={{ color: '#B0A090' }}>웨이팅 남음</p>
            <p
              className="font-extrabold leading-none"
              style={{ fontSize: '48px', color: isUrgent ? '#E74C3C' : '#1C1917', letterSpacing: '-2px', transition: 'color 0.3s' }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-xs font-semibold mt-2" style={{ color: '#C4B8A8' }}>
              복귀 예정 {returnTime.hour}:{returnTime.min}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col gap-3 px-5 pb-10 mt-8">
        <button
          onClick={handleDirections}
          className="w-full rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2C2416, #3D3020)', boxShadow: '0 6px 24px rgba(44,36,22,0.25)', padding: '18px' }}
        >
          <IoNavigateOutline size={18} color="white" />
          길찾기
        </button>
        <button
          onClick={handleOther}
          className="w-full rounded-2xl text-sm font-semibold active:scale-[0.97] transition-transform"
          style={{ background: 'rgba(255,255,255,0.85)', color: '#6B5A47', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', backdropFilter: 'blur(8px)', padding: '16px' }}
        >
          다른 곳 추천해줘
        </button>
      </div>
    </div>
  )
}