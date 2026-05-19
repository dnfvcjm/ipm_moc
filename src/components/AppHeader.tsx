import { Link } from 'react-router-dom';

type AppHeaderProps = {
  current?: string;
};

export default function AppHeader({ current }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link className="brand-link" to="/">
        <span>DN IPM</span>
        <strong>Spectral Scouting Mock</strong>
      </Link>
      {current ? <div className="header-current">{current}</div> : null}
    </header>
  );
}
