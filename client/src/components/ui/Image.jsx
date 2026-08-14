import { useState } from 'react';

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#E8DED0"/><g fill="#C9923E" opacity="0.5"><circle cx="600" cy="450" r="140"/></g><text x="600" y="470" font-family="Georgia,serif" font-size="44" fill="#14213D" text-anchor="middle" opacity="0.45">Trendz Upholstery</text></svg>`
);

export default function Image({ src, alt = '', className = '', imgClassName = '', eager = false, ...rest }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-beige/60 ${className}`}>
      {!loaded && !error && <div className="absolute inset-0 animate-pulse bg-beige/80" />}
      {src && (
        <img
          src={error ? FALLBACK : src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded || error ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
}
