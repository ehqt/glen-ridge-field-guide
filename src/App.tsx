import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BudgetPage from './pages/BudgetPage'
import Home from './pages/Home'
import InstitutionPage from './pages/InstitutionPage'
import NotFound from './pages/NotFound'
import OnePager from './pages/OnePager'
import ReportError from './pages/ReportError'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="institutions/:id" element={<InstitutionPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="at-a-glance" element={<OnePager />} />
        <Route path="report" element={<ReportError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
