export function GradientBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 translate-x-[-10%] translate-y-[-10%] opacity-30 blur-3xl overflow-hidden"
      >
        <div
          style={{
            clipPath:
              'polygon(30% 0%, 49% 18%, 100% 11%, 100% 46%, 50% 100%, 44% 51%, 0% 61%, 0 0)',
          }}
          className={`size-[120%] bg-gradient-to-br bg-sky-500 to-blue-500`}
        />
      </div>
      <div className="absolute inset-0 size-full bg-gradient-to-l from-zinc-100/40 via-50% via-zinc-100/70 to-80% to-transparent z-[1]"/>
    </>
  )
}