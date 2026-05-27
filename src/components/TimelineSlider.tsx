import { WEEK_OPTIONS } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';

type TimelineSliderProps = {
  value: number;
  onChange: (weekOffset: number) => void;
};

export default function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  const { t, weekLabel } = useI18n();
  const index = WEEK_OPTIONS.findIndex((week) => week.weekOffset === value);

  return (
    <div className="timeline-slider">
      <div className="timeline-labels">
        {WEEK_OPTIONS.map((week) => (
          <button
            className={week.weekOffset === value ? 'active' : ''}
            key={week.weekOffset}
            onClick={() => onChange(week.weekOffset)}
          type="button"
        >
            {weekLabel(week.weekOffset)}
          </button>
        ))}
      </div>
      <input
        aria-label={t.timelineHeatmap.title}
        max={WEEK_OPTIONS.length - 1}
        min={0}
        onChange={(event) => onChange(WEEK_OPTIONS[Number(event.target.value)].weekOffset)}
        type="range"
        value={index < 0 ? WEEK_OPTIONS.length - 1 : index}
      />
    </div>
  );
}
