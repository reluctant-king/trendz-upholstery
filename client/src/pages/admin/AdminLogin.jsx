import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../lib/api';
import { useSeo } from '../../hooks/useSeo';

export default function AdminLogin() {
  useSeo({ title: 'Admin Login' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('is-admin');
    return () => document.documentElement.classList.remove('is-admin');
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell dark relative flex min-h-screen items-center justify-center bg-deep px-5 py-12">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-gold">
          <ArrowLeft size={15} /> Back to website
        </Link>
        <div className="rounded-4xl bg-surface p-8 shadow-lift ring-1 ring-white/10 sm:p-10">
          <div className="mb-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-gold/15 text-gold">
              <Lock size={22} />
            </span>
            <h1 className="mt-4 font-display text-2xl text-navy">Admin Login</h1>
            <p className="mt-1 text-sm text-ink/50">Sign in to manage your studio</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="label-base" htmlFor="a-email">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
                <input
                  id="a-email"
                  type="email"
                  className="input-base pl-11"
                  placeholder="admin@trendz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-base" htmlFor="a-password">Password</label>
              <input
                id="a-password"
                type="password"
                className="input-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
