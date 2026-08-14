import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page Not Found' });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-7xl text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl text-navy">Page Not Found</h1>
      <p className="mt-3 max-w-sm text-sm text-ink/55">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-8 px-8 py-4">
        Back to Home
      </Link>
    </div>
  );
}
