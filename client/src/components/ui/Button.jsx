import { Link } from 'react-router-dom';

const sizes = {
  sm: 'px-5 py-2.5',
  md: 'px-7 py-3.5',
  lg: 'px-9 py-4 text-[13px]',
};

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const cls = `${variantClass(variant)} ${sizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

function variantClass(variant) {
  switch (variant) {
    case 'primary':
      return 'btn-primary';
    case 'outline':
      return 'btn-outline';
    case 'white':
      return 'btn-white';
    case 'dark':
      return 'btn-dark';
    default:
      return 'btn-primary';
  }
}
