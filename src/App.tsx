import { Navigate, Route, Routes } from 'react-router-dom';
import AdminHomePage from './pages/AdminHomePage';
import AnalysisListPage from './pages/AnalysisListPage';
import CaptureConfirmPage from './pages/CaptureConfirmPage';
import CaptureGuidePage from './pages/CaptureGuidePage';
import ClassificationPage from './pages/ClassificationPage';
import DetailPage from './pages/DetailPage';
import HeatmapPage from './pages/HeatmapPage';
import HomePage from './pages/HomePage';
import LanePlantInputPage from './pages/LanePlantInputPage';
import SaveCompletePage from './pages/SaveCompletePage';
import ScoutingStartPage from './pages/ScoutingStartPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scouting/start" element={<ScoutingStartPage />} />
      <Route path="/scouting/input" element={<LanePlantInputPage />} />
      <Route path="/scouting/capture" element={<CaptureGuidePage />} />
      <Route path="/scouting/confirm" element={<CaptureConfirmPage />} />
      <Route path="/scouting/saved" element={<SaveCompletePage />} />
      <Route path="/admin" element={<AdminHomePage />} />
      <Route path="/admin/analysis" element={<AnalysisListPage />} />
      <Route path="/admin/classification" element={<ClassificationPage />} />
      <Route path="/admin/heatmap" element={<HeatmapPage />} />
      <Route path="/admin/detail/:id" element={<DetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
