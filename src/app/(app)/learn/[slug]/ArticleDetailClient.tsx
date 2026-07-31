"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { BackButton } from "@/components/ui/BackButton";
import { CATEGORY_META, type KnowledgeCategoryValue } from "@/components/knowledge/LearnClient";

interface RelatedSupplement {
  id: string;
  name: string;
  servingLabel: string;
  activeIngredient: string;
}

interface ArticleDetailData {
  title: string;
  category: KnowledgeCategoryValue;
  content: string;
  relatedSupplement: RelatedSupplement | null;
}

export function ArticleDetailClient({ article }: { article: ArticleDetailData }) {
  const meta = CATEGORY_META[article.category];
  const Icon = meta.icon;

  // Content is written as plain paragraphs separated by blank lines --
  // no markdown/rich-text pipeline needed for this app, just simple
  // whitespace-aware rendering.
  const paragraphs = article.content.split("\n\n").filter((p) => p.trim());

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <BackButton className="mb-3" />

      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised ${meta.colorClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p className={`text-xs font-semibold uppercase tracking-wider ${meta.colorClass}`}>{meta.label}</p>
      </div>

      <h1 className="mt-3 font-display text-2xl font-bold text-text-primary sm:text-3xl">{article.title}</h1>

      <div className="mt-5 flex flex-col gap-4">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>

      {article.relatedSupplement && (
        <Card className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Related supplement
          </p>
          <p className="mt-1 font-display text-lg font-bold text-text-primary">
            {article.relatedSupplement.name}
          </p>
          <p className="mt-0.5 text-sm text-text-tertiary">
            {article.relatedSupplement.servingLabel} · {article.relatedSupplement.activeIngredient}
          </p>
          <Link
            href="/foods"
            className="mt-3 inline-block text-sm font-medium text-accent-info hover:underline"
          >
            Find it in Foods → Supplements
          </Link>
        </Card>
      )}
    </main>
  );
}
