import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoTimeOutline } from 'react-icons/io5'

export default function TimerBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [totalSeconds, setTotalSeconds] = useState(null)

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem('session') || 'null')
    if (!session) return

    const total = session.waitingTime * 60

    const tick = () => {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
      const remaining = Math.max(total - elapsed, 0)
      setRemainingSeconds(remaining)
      setTotalSeconds(total)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [location.pathname])

  const hideOn = ['/', '/home']
  if (hideOn.includes(location.pathname)) return null
  if (remainingSeconds === null) return null

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const progress = totalSeconds ? (remainingSeconds / totalSeconds) * 100 : 100
  const isUrgent = remainingSeconds < 300

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');

        .timer-bar-wrap {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .timer-bar-inner {
          max-width: 390px;
          margin: 0 auto;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201,169,110,0.15);
          padding: 10px 20px 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: background 0.3s;
        }

        .timer-bar-inner.urgent {
          background: rgba(255,245,235,0.95);
        }

        .timer-bar-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .timer-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .timer-bar-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #C9A96E;
          font-family: 'Pretendard', -apple-system, sans-serif;
        }

        .timer-bar-time {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.4px;
          font-family: 'Pretendard', -apple-system, sans-serif;
          transition: color 0.3s;
        }

        .timer-bar-time.normal { color: #1C1917; }
        .timer-bar-time.urgent { color: #C0392B; }

        .timer-bar-track {
          height: 3px;
          background: #EDE4D8;
          border-radius: 99px;
          overflow: hidden;
        }

        .timer-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 1s linear, background-color 0.3s;
        }

        .timer-bar-fill.normal {
          background: linear-gradient(90deg, #C9A96E, #A07840);
        }

        .timer-bar-fill.urgent {
          background: linear-gradient(90deg, #E74C3C, #C0392B);
        }

        .timer-bar-arrow {
          color: #C4B8A8;
          flex-shrink: 0;
          font-size: 16px;
          font-weight: 300;
        }
      `}</style>

      <div className="timer-bar-wrap" onClick={() => navigate('/timer')}>
        <div className={`timer-bar-inner ${isUrgent ? 'urgent' : ''}`}>
          <IoTimeOutline size={16} color="#C9A96E" style={{ flexShrink: 0 }} />
          <div className="timer-bar-content">
            <div className="timer-bar-row">
              <span className="timer-bar-label">웨이팅 남음</span>
              <span className={`timer-bar-time ${isUrgent ? 'urgent' : 'normal'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <div className="timer-bar-track">
              <div
                className={`timer-bar-fill ${isUrgent ? 'urgent' : 'normal'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="timer-bar-arrow">›</div>
        </div>
      </div>

      <div style={{ height: '52px' }} />
    </>
  )
}