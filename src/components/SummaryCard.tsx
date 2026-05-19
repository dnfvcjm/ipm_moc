type SummaryCardProps = {
  title: string;
  value: string | number;
  note?: string;
  tone?: 'default' | 'good' | 'warning' | 'danger' | 'info';
};

export default function SummaryCard({ title, value, note, tone = 'default' }: SummaryCardProps) {
  return (
    <section className={`summary-card summary-${tone}`}>
      <p>{title}</p>
      <strong>{value}</strong>
      {note ? <span>{note}</span> : null}
    </section>
  );
}
