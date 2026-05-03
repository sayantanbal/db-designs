import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, PenLine, Quote, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuoteItem = {
  author: string;
  content: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
  id: number;
};

type QuotesApiResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: QuoteItem[];
  };
  message: string;
  success: boolean;
};

const API_URL = "https://api.freeapi.app/api/v1/public/quotes";

async function getQuotes(page: number) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        quotes: [],
        meta: null,
        error: "Failed to fetch quotes.",
      } as const;
    }

    const payload = (await response.json()) as QuotesApiResponse;
    const meta = payload.data;

    return {
      quotes: meta.data,
      meta,
      error: null,
    } as const;
  } catch (_error) {
    return { quotes: [], meta: null, error: "Unable to load quotes." } as const;
  }
}

const tagThemes = [
  "border-amber-200 bg-amber-50 text-amber-800",
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-rose-200 bg-rose-50 text-rose-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-indigo-200 bg-indigo-50 text-indigo-700",
];

function getTagTheme(tag: string) {
  const seed = Array.from(tag).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  return tagThemes[seed % tagThemes.length];
}

type QuotesPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.max(1, requestedPage);
  const { quotes, meta, error } = await getQuotes(currentPage);
  const lastUpdated = new Date();
  const formattedLastUpdated = lastUpdated.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const authorCount = new Set(quotes.map((quote) => quote.author)).size;
  const tagCount = new Set(
    quotes.flatMap((quote) => quote.tags).filter(Boolean),
  ).size;
  const averageLength = quotes.length
    ? Math.round(
        quotes.reduce((total, quote) => total + quote.length, 0) /
          quotes.length,
      )
    : 0;
  const spotlightQuote = quotes.reduce<QuoteItem | null>((best, quote) => {
    if (!best || quote.length > best.length) {
      return quote;
    }
    return best;
  }, null);

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_15%_20%,var(--quotes-glow)_0%,#fff8f0_45%,#f2f3ff_100%)] px-4 py-8 sm:px-6 lg:px-10"
      style={
        {
          "--quotes-glow": "#fde8c8",
          "--quotes-ink": "#1f2937",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,#fcd34d,transparent_70%)] opacity-60" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,#c7d2fe,transparent_70%)] opacity-60" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ffe4e6,transparent_70%)] opacity-60" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Cohort Assignment Hub
        </div>

        <section className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1
                className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--quotes-ink)] sm:text-4xl"
                style={{
                  fontFamily: '"Playfair Display", "Space Grotesk", serif',
                }}
              >
                Quotes Listing
              </h1>
              <p className="max-w-2xl text-sm text-zinc-700 sm:text-base">
                Curate timeless quotes with author highlights, theme tags, and a
                calm reading layout. Built for quick inspiration and focused
                browsing.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 text-xs text-zinc-600 sm:items-end">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/freeapi" className="inline-flex">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back To FreeAPI
                  </Button>
                </Link>
              </div>
              <span>Last updated: {formattedLastUpdated}</span>
            </div>
          </div>

          {meta && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 text-xs text-zinc-700 sm:grid-cols-3">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-amber-800">
                    Page
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.page} / {meta.totalPages}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-amber-800">
                    Total Quotes
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.totalItems}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-indigo-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-indigo-700">
                    On This Page
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.currentPageItems} quotes
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Page {meta.page} Overview
                </span>
                <div className="flex items-center gap-2">
                  {meta.previousPage ? (
                    <Link
                      href={`?page=${meta.page - 1}`}
                      className="inline-flex"
                    >
                      <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Prev
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Prev
                    </Button>
                  )}
                  {meta.nextPage ? (
                    <Link
                      href={`?page=${meta.page + 1}`}
                      className="inline-flex"
                    >
                      <Button variant="outline" size="sm">
                        Next
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {error ? (
          <Card className="border-rose-200 bg-rose-50/80">
            <CardHeader>
              <CardTitle>Unable to load quotes</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4">
              {quotes.map((quoteItem) => {
                const tags =
                  quoteItem.tags.length > 0 ? quoteItem.tags : ["Classic"];

                return (
                  <Card
                    key={quoteItem.id}
                    className="border-amber-100 bg-white/90"
                  >
                    <CardHeader className="gap-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg text-zinc-900">
                            {quoteItem.author}
                          </CardTitle>
                          <CardDescription className="text-xs uppercase tracking-wide text-amber-800">
                            Quote #{quoteItem.id}
                          </CardDescription>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase text-amber-800">
                          <Quote className="h-3.5 w-3.5" aria-hidden="true" />
                          Highlight
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-base text-zinc-700">
                        {quoteItem.content}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={`${quoteItem.id}-${tag}`}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getTagTheme(
                              tag,
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                        <span className="inline-flex items-center gap-2">
                          <PenLine className="h-4 w-4 text-amber-700" />
                          {quoteItem.length} characters
                        </span>
                        <span className="text-[11px] uppercase tracking-wide">
                          {quoteItem.authorSlug.replaceAll("-", " ")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-6">
              <Card className="border-amber-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">Reading pulse</CardTitle>
                  <CardDescription>
                    Quick snapshot of the current page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-zinc-600">
                  <div className="flex items-center justify-between rounded-2xl bg-amber-50/70 px-4 py-3">
                    <span>Authors featured</span>
                    <span className="font-semibold text-zinc-900">
                      {authorCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-indigo-50/70 px-4 py-3">
                    <span>Tags discovered</span>
                    <span className="font-semibold text-zinc-900">
                      {tagCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-rose-50/70 px-4 py-3">
                    <span>Avg length</span>
                    <span className="font-semibold text-zinc-900">
                      {averageLength} chars
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">Spotlight quote</CardTitle>
                  <CardDescription>
                    Longest quote on this page for deep reading.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-700">
                  {spotlightQuote ? (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3">
                      <p className="text-sm text-zinc-700">
                        {spotlightQuote.content}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-800">
                        {spotlightQuote.author}
                      </p>
                    </div>
                  ) : (
                    <p>Quotes will appear here once available.</p>
                  )}
                  <p className="text-xs text-zinc-600">
                    Use the page controls to discover more authors and themes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
