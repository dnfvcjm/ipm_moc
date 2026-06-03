import type { SpectralMarker } from '../utils/spectralMarkers';

type SpectralMarkerOverlayProps = {
  markers: SpectralMarker[];
  label: string;
};

export default function SpectralMarkerOverlay({ markers, label }: SpectralMarkerOverlayProps) {
  if (markers.length === 0) return null;

  return (
    <div aria-label={label} className="spectral-marker-overlay">
      {markers.map((marker, index) => (
        <span
          aria-label={`${label} ${index + 1}`}
          className={`spectral-detection-marker marker-${marker.size}`}
          key={`${marker.left}-${marker.top}-${index}`}
          style={{ left: marker.left, top: marker.top }}
          title={`${label} ${index + 1}`}
        />
      ))}
    </div>
  );
}
