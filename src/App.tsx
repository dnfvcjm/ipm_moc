import { Navigate, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import AnalysisFlowPage from './pages/AnalysisFlowPage';
import AnalysisQueuePage from './pages/AnalysisQueuePage';
import AreaDetailPage from './pages/AreaDetailPage';
import AreaHeatmapPage from './pages/AreaHeatmapPage';
import BlurCheckPage from './pages/BlurCheckPage';
import CaptureSessionPage from './pages/CaptureSessionPage';
import FieldAssignmentPage from './pages/FieldAssignmentPage';
import FieldTrendPage from './pages/FieldTrendPage';
import HomePage from './pages/HomePage';
import LaneCompletePage from './pages/LaneCompletePage';
import LaneQrScanPage from './pages/LaneQrScanPage';
import SdCardDataPage from './pages/SdCardDataPage';
import TimelineHeatmapPage from './pages/TimelineHeatmapPage';

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assignment" element={<FieldAssignmentPage />} />
        <Route path="/lane-qr" element={<LaneQrScanPage />} />
        <Route path="/capture" element={<CaptureSessionPage />} />
        <Route path="/blur-check" element={<BlurCheckPage />} />
        <Route path="/lane-complete" element={<LaneCompletePage />} />
        <Route path="/sd-card" element={<SdCardDataPage />} />
        <Route path="/analysis" element={<AnalysisQueuePage />} />
        <Route path="/analysis/:id" element={<AnalysisFlowPage />} />
        <Route path="/unanalyzed" element={<Navigate to="/analysis" replace />} />
        <Route path="/heatmap" element={<AreaHeatmapPage />} />
        <Route path="/timeline-heatmap" element={<TimelineHeatmapPage />} />
        <Route path="/area/:areaId" element={<AreaDetailPage />} />
        <Route path="/trend" element={<FieldTrendPage />} />

        <Route path="/scouting/*" element={<Navigate to="/assignment" replace />} />
        <Route path="/admin/analysis" element={<Navigate to="/analysis" replace />} />
        <Route path="/admin/heatmap" element={<Navigate to="/heatmap" replace />} />
        <Route path="/admin/*" element={<Navigate to="/analysis" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}
