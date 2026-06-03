import { useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';

type TomatoLeafPreviewProps = {
  imageSrc?: string;
  fallbackSrc: string;
  isBlurred?: boolean;
};

export default function TomatoLeafPreview({
  imageSrc = '/images/capture-leaf-preview.png',
  fallbackSrc,
  isBlurred = false,
}: TomatoLeafPreviewProps) {
  const { t } = useI18n();
  const [useFallback, setUseFallback] = useState(false);
  const displaySrc = useFallback ? fallbackSrc : imageSrc;

  return (
    <div className={`tomato-leaf-preview ${isBlurred ? 'is-soft-focus' : ''}`}>
      <div className="tomato-field-backdrop" />
      <img
        alt={`${t.common.tomato} ${t.common.leaf}`}
        className="tomato-leaf-subject"
        onError={() => setUseFallback(true)}
        src={displaySrc}
      />
    </div>
  );
}
