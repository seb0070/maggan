import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TimerBar from './components/TimerBar'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Recommendation from './pages/Recommendation'
import PlaceList from './pages/PlaceList'
import PlaceDetail from './pages/PlaceDetail'
import Timer from './pages/Timer'

function App() {
  return (
    <BrowserRouter>
      <TimerBar />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/list" element={<PlaceList />} />
        <Route path="/detail" element={<PlaceDetail />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App