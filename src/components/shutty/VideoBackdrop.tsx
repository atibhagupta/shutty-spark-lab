/** Looping ambient motion video used as a section background. */
export function VideoBackdrop({
  src,
  className = "",
  overlay = true,
}: {
  src: string;
  className?: string;
  overlay?: boolean;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      {overlay && (
        <>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90" />
        </>
      )}
    </div>
  );
}