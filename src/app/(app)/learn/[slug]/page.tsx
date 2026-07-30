import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleDetailClient } from "./ArticleDetailClient";

// Same reasoning as the /learn listing page -- explicit rather than
// relying on the default (unspecified) behavior for a dynamic segment
// with no generateStaticParams.
export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await db.knowledgeArticle.findUnique({
    where: { slug },
    include: {
      relatedSupplement: {
        select: { id: true, name: true, servingLabel: true, activeIngredient: true },
      },
    },
  });
  if (!article) notFound();

  return (
    <ArticleDetailClient
      article={{
        title: article.title,
        category: article.category,
        content: article.content,
        relatedSupplement: article.relatedSupplement,
      }}
    />
  );
}
