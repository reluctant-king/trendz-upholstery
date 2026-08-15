import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ dark = false, className = '' }) {
  const { theme, toggle } = useTheme();
  const base = dark
    ? 'border-white/15 text-white hover:bg-gold hover:text-deep'
    : 'border-ink/10 bg-surface/70 text-navy backdrop-blur hover:bg-gold hover:text-deep';

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${base} ${className}`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
