export default function LearnLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <div className="mb-5 flex flex-col items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-surface-raised" />
        <div className="h-7 w-24 animate-pulse rounded bg-surface-raised" />
        <div className="h-4 w-72 animate-pulse rounded bg-surface-raised" />
      </div>
      <div className="mb-3 h-11 animate-pulse rounded-control bg-surface-raised" />
      <div className="mb-4 h-9 animate-pulse rounded-control bg-surface-raised" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-control bg-surface-raised" />
        ))}
      </div>
    </main>
  );
}
