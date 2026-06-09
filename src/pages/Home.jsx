import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { IoLocationSharp } from 'react-icons/io5'

export default function Home() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [waitingTime, setWaitingTime] = useState(40)
  const searchTimeout = useRef(null)

  const searchPlace = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([])
      return
    }
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&size=5`,
        { headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` } }
      )
      const data = await res.json()
      setSearchResults(data.documents || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSearchInput = (e) => {
    const val = e.target.value
    setSearchText(val)
    setSelectedPlace(null)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => searchPlace(val), 400)
  }

  const handleSelectPlace = (place) => {
    setSelectedPlace({
      name: place.place_name,
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    })
    setSearchText(place.place_name)
    setSearchResults([])
  }

  const handleStart = () => {
    if (!selectedPlace) return
    const sessionData = {
      waitingPlace: selectedPlace.name,
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      waitingTime,
      startedAt: Date.now(),
    }
    sessionStorage.setItem('session', JSON.stringify(sessionData))
    navigate('/recommendation')
  }

  const sliderPercent = ((waitingTime - 5) / (120 - 5)) * 100

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');

        .home-root {
          width: 100%;
          min-height: 100vh;
          max-width: 390px;
  margin: 0 auto;
          background: linear-gradient(160deg, #FDF6ED 0%, #F5ECD9 100%);
          display: flex;
          flex-direction: column;
          padding: 0 24px 48px;
          font-family: 'Pretendard', -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .home-root::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -80px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(210,175,120,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .home-header {
          padding-top: 64px;
          margin-bottom: 44px;
        }

        .home-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C9A96E;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .home-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 2px;
          background: #C9A96E;
          border-radius: 2px;
        }

        .home-title {
          font-size: 30px;
          font-weight: 800;
          color: #1C1917;
          line-height: 1.25;
          letter-spacing: -0.8px;
          margin-bottom: 8px;
        }

        .home-sub {
          font-size: 14px;
          font-weight: 500;
          color: #A8978A;
        }

        .section-label {
          font-size: 12px;
          font-weight: 700;
          color: #C9A96E;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .search-wrap {
          position: relative;
          margin-bottom: 8px;
        }

        .search-icon-left {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #C4B8A8;
          display: flex;
          align-items: center;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 16px 44px 16px 50px;
          font-size: 15px;
          font-weight: 500;
          color: #1C1917;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 16px rgba(160,130,90,0.08), 0 1px 3px rgba(0,0,0,0.04);
          box-sizing: border-box;
        }

        .search-input::placeholder { color: #C4B8A8; }

        .search-input:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 4px rgba(201,169,110,0.12), 0 2px 16px rgba(160,130,90,0.08);
        }

        .search-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #E8DDD0;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #8C7B6E;
          font-family: inherit;
        }

        .search-dropdown {
          background: rgba(255,255,255,0.97);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          margin-bottom: 12px;
        }

        .search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: background 0.15s;
        }

        .search-item:last-child { border-bottom: none; }
        .search-item:active { background: #F5EFE4; }

        .search-item-name {
          font-size: 14px;
          font-weight: 600;
          color: #1C1917;
          margin-bottom: 2px;
        }

        .search-item-addr {
          font-size: 12px;
          color: #B0A090;
        }

        .selected-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,169,110,0.12);
          border-radius: 10px;
          padding: 9px 14px;
          margin-bottom: 28px;
        }

        .selected-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #C9A96E;
          flex-shrink: 0;
        }

        .selected-text {
          font-size: 13px;
          font-weight: 600;
          color: #A07840;
        }

        .slider-section {
          margin-bottom: 36px;
        }

        .slider-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          padding: 24px 22px;
          box-shadow: 0 2px 16px rgba(160,130,90,0.08), 0 1px 3px rgba(0,0,0,0.04);
        }

        .slider-time-display {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 20px;
        }

        .slider-number {
          font-size: 52px;
          font-weight: 800;
          color: #1C1917;
          letter-spacing: -2px;
          line-height: 1;
        }

        .slider-unit {
          font-size: 18px;
          font-weight: 600;
          color: #A8978A;
        }

        .slider-track-wrap {
          position: relative;
          height: 6px;
          margin-bottom: 12px;
          border-radius: 99px;
        }

        .slider-bg {
          position: absolute;
          inset: 0;
          border-radius: 99px;
          background: #EDE4D8;
        }

        .slider-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #C9A96E, #A07840);
          pointer-events: none;
        }

        .slider-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          margin: 0;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 600;
          color: #C4B8A8;
        }

        .start-btn {
          width: 100%;
          padding: 20px;
          border-radius: 20px;
          border: none;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.3px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .start-btn.active {
          background: linear-gradient(135deg, #2C2416, #3D3020);
          color: #FFFFFF;
          box-shadow: 0 6px 24px rgba(44,36,22,0.28);
        }

        .start-btn.active:active { transform: scale(0.97); }

        .start-btn.inactive {
          background: #EDE4D8;
          color: #C4B8A8;
          cursor: default;
        }
      `}</style>

      <div className="home-root">

        {/* 헤더 */}
        <div className="home-header">
          <div className="home-eyebrow">막간</div>
          <div className="home-title">지금 웨이팅 중인<br />가게가 어디예요?</div>
          <div className="home-sub">잠깐 다녀올 곳을 찾아드릴게요</div>
        </div>

        {/* 검색 */}
        <div className="section-label">웨이팅 중인 가게</div>
        <div className="search-wrap">
          <div className="search-icon-left">
            <FiSearch size={18} />
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="가게 이름을 검색하세요"
            value={searchText}
            onChange={handleSearchInput}
          />
          {searchText && (
            <button
              className="search-clear"
              onClick={() => { setSearchText(''); setSelectedPlace(null); setSearchResults([]) }}
            >✕</button>
          )}
        </div>

        {/* 드롭다운 */}
        {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((place) => (
              <button
                key={place.id}
                className="search-item"
                onClick={() => handleSelectPlace(place)}
              >
                <IoLocationSharp size={18} color="#C9A96E" style={{ flexShrink: 0 }} />
                <div>
                  <div className="search-item-name">{place.place_name}</div>
                  <div className="search-item-addr">{place.address_name}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 선택된 장소 */}
        {selectedPlace && (
          <div className="selected-badge">
            <div className="selected-dot" />
            <div className="selected-text">{selectedPlace.name} 선택됨</div>
          </div>
        )}

        {/* 슬라이더 */}
        <div className="slider-section">
          <div className="section-label">남은 대기 시간</div>
          <div className="slider-card">
            <div className="slider-time-display">
              <span className="slider-number">{waitingTime}</span>
              <span className="slider-unit">분</span>
            </div>
            <div className="slider-track-wrap">
              <div className="slider-bg" />
              <div className="slider-fill" style={{ width: `${sliderPercent}%` }} />
              <input
                className="slider-input"
                type="range"
                min={5}
                max={120}
                step={5}
                value={waitingTime}
                onChange={(e) => setWaitingTime(Number(e.target.value))}
              />
            </div>
            <div className="slider-labels">
              <span>5분</span>
              <span>30분</span>
              <span>60분</span>
              <span>90분</span>
              <span>120분</span>
            </div>
          </div>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          disabled={!selectedPlace}
          className={`start-btn ${selectedPlace ? 'active' : 'inactive'}`}
        >
          ✦ 막간 추천 시작하기
        </button>

      </div>
    </>
  )
}