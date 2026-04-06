import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import { AppLayout } from './components/layout/AppLayout'
import { MusicPlaybackProvider } from './context/MusicPlaybackProvider'
import FinalePage from './pages/FinalePage'
import GalleryPage from './pages/GalleryPage'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import LetterPage from './pages/LetterPage'
import VideosPage from './pages/VideosPage'

export default function App() {
  return (
    <BrowserRouter>
      <MusicPlaybackProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/letter" element={<LetterPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/finale" element={<FinalePage />} />
          </Route>
        </Routes>
      </MusicPlaybackProvider>
    </BrowserRouter>
  )
}
