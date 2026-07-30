import { db } from "@/lib/db";
import { LearnClient, type ArticleSummary } from "@/components/knowledge/LearnClient";

// Every other page under (app) calls createSupabaseServerClient(), which
// uses cookies() internally and implicitly forces Next.js to treat the
// page as dynamic (rendered per-request, not at build time). This page
// doesn't need per-user data, so it was the first one that skipped that
// call -- and without any signal telling Next.js otherwise, it tried to
// statically pre-render this page during `next build`, which means
// hitting the database at build time, where no live connection exists.
// That's what "Can't reach database server at localhost:5432" during the
// build actually was: not a real database problem, a rendering-mode one.
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const articles = await db.knowledgeArticle.findMany({
    orderBy: { title: "asc" },
    select: { id: true, slug: true, title: true, category: true, summary: true },
  });

  const summaries: ArticleSummary[] = articles.map((a: (typeof articles)[number]) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    summary: a.summary,
  }));

  return <LearnClient articles={summaries} />;
}
