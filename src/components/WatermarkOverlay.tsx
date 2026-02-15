/**
 * Translucent repeating diagonal "Sortak" watermark overlay.
 * CSS-only — sits on top of displayed images to discourage screenshots.
 * Does NOT affect downloaded files since those use the raw imageDataUrl.
 */
export function WatermarkOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        className="absolute"
        style={{
          /* Make the grid large enough to cover after rotation */
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          transform: 'rotate(-30deg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center',
          gap: '32px 48px',
        }}
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.25)',
              textShadow: '0 0 2px rgba(0, 0, 0, 0.15)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            Sortak
          </span>
        ))}
      </div>
    </div>
  );
}
