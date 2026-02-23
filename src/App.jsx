import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ReferenceIndex from './pages/ReferenceIndex'
import ReferencePage from './pages/ReferencePage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reference" element={<ReferenceIndex />} />
        <Route path="/reference/:classId" element={<ReferencePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
