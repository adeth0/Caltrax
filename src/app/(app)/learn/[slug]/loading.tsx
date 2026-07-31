export default function ArticleDetailLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <div className="mb-3 h-9 w-20 animate-pulse rounded-full bg-surface-raised" />
      <div className="mb-3 h-4 w-24 animate-pulse rounded bg-surface-raised" />
      <div className="mb-5 h-8 w-3/4 animate-pulse rounded bg-surface-raised" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-surface-raised" />
        ))}
      </div>
    </main>
  );
}
