import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    id: 'explore',
    step: '01',
    question: '어떤 곳이\n좋으세요?',
    sub: '평소 가던 곳, 아니면 새로운 곳?',
    options: [
      { value: '새로운 곳 탐험', icon: '🗺️', label: '새로운 곳 탐험', desc: '낯선 곳도 설레요' },
      { value: '검증된 곳 선호', icon: '⭐', label: '검증된 곳 선호', desc: '아는 곳이 편해요' },
    ],
  },
  {
    id: 'activity',
    step: '02',
    question: '막간에 뭘\n하고 싶어요?',
    sub: '주로 시간 보내는 스타일',
    options: [
      { value: '둘러보기', icon: '👀', label: '둘러보기', desc: '구경하며 발길 닿는 대로' },
      { value: '잠깐 쉬기', icon: '☕', label: '잠깐 쉬기', desc: '앉아서 여유롭게' },
      { value: '걷기', icon: '🚶', label: '걷기', desc: '가볍게 산책하고 싶어요' },
    ],
  },
  {
    id: 'indoor',
    step: '03',
    question: '실내가 편해요,\n실외가 좋아요?',
    sub: '날씨에 따라 달라질 수도 있어요',
    options: [
      { value: '실내 선호', icon: '🏠', label: '실내 선호', desc: '쾌적한 실내가 좋아요' },
      { value: '날씨 좋으면 실외도 좋아요', icon: '🌤️', label: '날씨 좋으면 실외도', desc: '맑은 날엔 밖이 좋아요' },
    ],
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [currentStep])

  const step = steps[currentStep]

  const handleSelect = (value) => setSelected(value)

  const handleNext = () => {
    if (!selected) return
    setVisible(false)
    setTimeout(() => {
      const newAnswers = { ...answers, [step.id]: selected }
      setAnswers(newAnswers)
      setSelected(null)
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        localStorage.setItem('preference', JSON.stringify(newAnswers))
        navigate('/home')
      }
    }, 200)
  }

  const handleSkip = () => navigate('/home')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');

        .ob-wrap {
          min-height: 100vh;
          background: linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Pretendard', -apple-system, sans-serif;
        }

        .ob-phone {
          width: 100%;
          max-width: 390px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0 24px;
          position: relative;
          overflow: hidden;
        }

        /* 배경 장식 원 */
        .ob-phone::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -60px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(210,175,120,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .ob-phone::after {
          content: '';
          position: absolute;
          bottom: 100px;
          left: -80px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,140,90,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .ob-progress {
          display: flex;
          gap: 6px;
          padding-top: 60px;
          margin-bottom: 44px;
        }

        .ob-seg {
          flex: 1;
          height: 3px;
          border-radius: 99px;
          transition: all 0.5s ease;
        }

        .ob-header {
          margin-bottom: 40px;
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        .ob-step-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C9A96E;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ob-step-label::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 2px;
          background: #C9A96E;
          border-radius: 2px;
        }

        .ob-question {
          font-size: 34px;
          font-weight: 800;
          color: #1C1917;
          line-height: 1.2;
          letter-spacing: -1px;
          white-space: pre-line;
          margin-bottom: 10px;
        }

        .ob-sub {
          font-size: 14px;
          font-weight: 500;
          color: #A8978A;
        }

        .ob-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        .ob-card {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          text-align: left;
          border-radius: 20px;
          padding: 18px 20px;
          cursor: pointer;
          border: none;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .ob-card.idle {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 2px 16px rgba(160,130,90,0.08),
            0 1px 3px rgba(0,0,0,0.04);
        }

        .ob-card.idle:active {
          transform: scale(0.97);
        }

        .ob-card.selected {
          background: linear-gradient(135deg, #2C2416 0%, #3D3020 100%);
          box-shadow:
            0 8px 32px rgba(44,36,22,0.28),
            0 2px 8px rgba(44,36,22,0.18);
          transform: scale(1.01);
        }

        .ob-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .ob-icon-box.idle {
          background: linear-gradient(135deg, #FDF0DC, #F5E4C0);
          box-shadow: 0 2px 8px rgba(180,140,80,0.15);
        }

        .ob-icon-box.selected {
          background: rgba(255,255,255,0.12);
        }

        .ob-label {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.3px;
          transition: color 0.2s;
        }

        .ob-desc {
          font-size: 12px;
          font-weight: 500;
          margin-top: 2px;
          transition: color 0.2s;
        }

        .ob-check {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .ob-check.idle {
          background: #F0E8DA;
          border: 1.5px solid #E0D4C0;
        }

        .ob-check.selected {
          background: #C9A96E;
        }

        .ob-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 48px;
          margin-top: auto;
        }

        .ob-skip {
          font-size: 14px;
          font-weight: 600;
          color: #C4B8A8;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 8px 4px;
        }

        .ob-next {
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.2px;
          border: none;
          border-radius: 18px;
          padding: 17px 36px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ob-next.active {
          background: linear-gradient(135deg, #2C2416 0%, #3D3020 100%);
          color: #FFFFFF;
          box-shadow: 0 6px 24px rgba(44,36,22,0.28);
        }

        .ob-next.active:active {
          transform: scale(0.96);
        }

        .ob-next.inactive {
          background: #EDE4D8;
          color: #C4B8A8;
          cursor: default;
        }
      `}</style>

      <div className="ob-wrap">
        <div className="ob-phone">

          {/* 진행 바 */}
          <div className="ob-progress">
            {steps.map((_, i) => (
              <div
                key={i}
                className="ob-seg"
                style={{
                  backgroundColor: i <= currentStep ? '#C9A96E' : '#E8DECE',
                  opacity: i < currentStep ? 0.45 : 1,
                }}
              />
            ))}
          </div>

          {/* 헤더 */}
          <div className="ob-header" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}>
            <div className="ob-step-label">{step.step} · 취향</div>
            <div className="ob-question">{step.question}</div>
            <div className="ob-sub">{step.sub}</div>
          </div>

          {/* 선택지 */}
          <div className="ob-options" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}>
            {step.options.map((opt) => {
              const isSel = selected === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`ob-card ${isSel ? 'selected' : 'idle'}`}
                >
                  <div className={`ob-icon-box ${isSel ? 'selected' : 'idle'}`}>
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ob-label" style={{ color: isSel ? '#FFFFFF' : '#1C1917' }}>
                      {opt.label}
                    </div>
                    <div className="ob-desc" style={{ color: isSel ? 'rgba(255,255,255,0.5)' : '#A8978A' }}>
                      {opt.desc}
                    </div>
                  </div>
                  <div className={`ob-check ${isSel ? 'selected' : 'idle'}`}>
                    {isSel && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* 하단 */}
          <div className="ob-footer">
            <button onClick={handleSkip} className="ob-skip">건너뛰기</button>
            <button
              onClick={handleNext}
              disabled={!selected}
              className={`ob-next ${selected ? 'active' : 'inactive'}`}
            >
              {currentStep === steps.length - 1 ? '시작하기 →' : '다음 →'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}