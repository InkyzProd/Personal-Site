export default function BackgroundAurora() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0a0a0a]"
    >
      <div
        className="aurora-blob-1 absolute -top-40 -left-32 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.45), rgba(88, 101, 242, 0.30) 60%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="aurora-blob-2 absolute top-[28%] -right-40 w-[680px] h-[680px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(88, 101, 242, 0.45), rgba(34, 197, 94, 0.25) 65%, transparent 85%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="aurora-blob-3 absolute -bottom-36 left-[10%] w-[580px] h-[580px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 45% 45%, rgba(88, 101, 242, 0.35), rgba(34, 197, 94, 0.25) 70%, transparent 85%)',
          filter: 'blur(110px)',
        }}
      />
      <div className="absolute inset-0 bg-[#0a0a0a]/20" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 15%, transparent 30%, rgba(10, 10, 10, 0.5) 100%)',
        }}
      />
    </div>
  );
}
