import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ReferenceIndex from './pages/ReferenceIndex'
import ReferencePage from './pages/ReferencePage'
import DocsIndex from './pages/DocsIndex'
import DocsPage from './pages/DocsPage'
import NotFound from './pages/NotFound'
import Security from './pages/Security'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<DocsIndex />} />
        <Route path="/docs/:docId" element={<DocsPage />} />
        <Route path="/reference" element={<ReferenceIndex />} />
        <Route path="/reference/:classId" element={<ReferencePage />} />
        <Route path="/security" element={<Security />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
