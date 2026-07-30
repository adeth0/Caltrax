import { db } from "@/lib/db";
import { LearnClient, type ArticleSummary } from "@/components/knowledge/LearnClient";

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
