import { ImageResponse } from 'next/server';

type IconOptions = {
  maskable?: boolean;
};

const backgroundColor = '#0b0b0d';
const borderColor = '#6366f1';
const gradientFrom = '#6366f1';
const gradientTo = '#312e81';
const textColor = '#f8fafc';

export function createIconResponse(size: number, { maskable = false }: IconOptions = {}) {
  const borderWidth = Math.round(size * 0.06);
  const borderRadius = maskable ? 0 : Math.round(size * 0.26);
  const fontSize = Math.round(size * 0.45);
  const letterSpacing = -Math.round(size * 0.05);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: `${borderRadius}px`,
            backgroundImage: `radial-gradient(circle at 30% 30%, ${gradientFrom}, ${gradientTo})`,
            border: `${borderWidth}px solid ${borderColor}`,
          }}
        >
          <span
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              letterSpacing: `${letterSpacing}px`,
              color: textColor,
              fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
            }}
          >
            VM
          </span>
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
