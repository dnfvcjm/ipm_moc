type PhotoPreviewMockProps = {
  title: string;
  imagePath: string;
  isBlurred?: boolean;
  note?: string;
};

export default function PhotoPreviewMock({ title, imagePath, isBlurred = false, note }: PhotoPreviewMockProps) {
  return (
    <figure className={`photo-preview ${isBlurred ? 'photo-blurred' : ''}`}>
      <img alt={title} src={imagePath} />
      <figcaption>
        <strong>{title}</strong>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}
