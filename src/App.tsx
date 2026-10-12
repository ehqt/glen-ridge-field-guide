import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BudgetPage from './pages/BudgetPage'
import CalendarPage from './pages/CalendarPage'
import FirstMeeting from './pages/FirstMeeting'
import Glossary from './pages/Glossary'
import Home from './pages/Home'
import IWantTo from './pages/IWantTo'
import InstitutionPage from './pages/InstitutionPage'
import NotFound from './pages/NotFound'
import Tour from './pages/Tour'
import OnePager from './pages/OnePager'
import PermitFinder from './pages/PermitFinder'
import PeoplePage from './pages/PeoplePage'
import ReportError from './pages/ReportError'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="institutions/:id" element={<InstitutionPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="at-a-glance" element={<OnePager />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="first-meeting" element={<FirstMeeting />} />
        <Route path="tour" element={<Tour />} />
        <Route path="permits" element={<PermitFinder />} />
        <Route path="i-want-to" element={<IWantTo />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="report" element={<ReportError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
