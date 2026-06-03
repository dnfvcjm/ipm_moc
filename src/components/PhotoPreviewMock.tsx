import SpectralMarkerOverlay from './SpectralMarkerOverlay';
import type { SpectralMarker } from '../utils/spectralMarkers';

type PhotoPreviewMockProps = {
  title: string;
  imagePath: string;
  isBlurred?: boolean;
  note?: string;
  markers?: SpectralMarker[];
  variant?: 'standard' | 'spectral';
};

export default function PhotoPreviewMock({
  title,
  imagePath,
  isBlurred = false,
  markers = [],
  note,
  variant = 'standard',
}: PhotoPreviewMockProps) {
  return (
    <figure className={`photo-preview ${isBlurred ? 'photo-blurred' : ''} ${variant === 'spectral' ? 'photo-preview-spectral' : ''}`}>
      <div className="photo-preview-image-frame">
        <img alt={title} src={imagePath} />
        {variant === 'spectral' ? <SpectralMarkerOverlay label={title} markers={markers} /> : null}
      </div>
      <figcaption>
        <strong>{title}</strong>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}
