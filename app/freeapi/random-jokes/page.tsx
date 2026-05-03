import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Joke = {
  categories: string[];
  id: number;
  content: string;
};

type RandomJokesApiResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: Joke[];
  };
  message: string;
  success: boolean;
};

const API_URL = "https://api.freeapi.app/api/v1/public/randomjokes";

async function getRandomJokes(page: number) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        jokes: [],
        meta: null,
        error: "Failed to fetch jokes.",
      } as const;
    }

    const payload = (await response.json()) as RandomJokesApiResponse;
    const meta = payload.data;

    return {
      jokes: meta.data,
      meta,
      error: null,
    } as const;
  } catch (_error) {
    return { jokes: [], meta: null, error: "Unable to load jokes." } as const;
  }
}

function getCategoryTheme(category: string) {
  if (category.toLowerCase() === "explicit") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-indigo-200 bg-indigo-50 text-indigo-700";
}

type RandomJokesPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function RandomJokesPage({
  searchParams,
}: RandomJokesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.max(1, requestedPage);
  const { jokes, meta, error } = await getRandomJokes(currentPage);
  const lastUpdated = new Date();
  const formattedLastUpdated = lastUpdated.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const categoryCount = new Set(
    jokes.flatMap((joke) => joke.categories).filter(Boolean),
  ).size;
  const explicitCount = jokes.filter((joke) =>
    joke.categories.some((category) => category.toLowerCase() === "explicit"),
  ).length;

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_10%_10%,var(--jokes-glow)_0%,#fef8ff_45%,#f2f5ff_100%)] px-4 py-8 sm:px-6 lg:px-10"
      style={
        {
          "--jokes-glow": "#f5d0fe",
          "--jokes-ink": "#1f2937",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,#c7d2fe,transparent_70%)] opacity-70" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,#f5d0fe,transparent_70%)] opacity-65" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#e0f2fe,transparent_70%)] opacity-70" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Cohort Assignment Hub
        </div>

        <section className="rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1
                className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--jokes-ink)] sm:text-4xl"
                style={{ fontFamily: '"Space Grotesk", "Geist", sans-serif' }}
              >
                Jokes Viewer
              </h1>
              <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
                Browse quick-fire jokes with category tags and paging controls.
                Stay on top of what is new, spicy, and trending across the feed.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 text-xs text-zinc-500 sm:items-end">
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
              <div className="grid gap-3 text-xs text-zinc-600 sm:grid-cols-3">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-indigo-700">
                    Page
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.page} / {meta.totalPages}
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-indigo-700">
                    Total Jokes
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.totalItems}
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-sky-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-sky-700">
                    On This Page
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.currentPageItems} jokes
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
              <CardTitle>Unable to load jokes</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4">
              {jokes.map((joke) => {
                const categories =
                  joke.categories.length > 0 ? joke.categories : ["general"];

                return (
                  <Card key={joke.id} className="border-indigo-100 bg-white/90">
                    <CardHeader className="gap-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg text-zinc-900">
                            Joke #{joke.id}
                          </CardTitle>
                          <CardDescription className="text-xs uppercase tracking-wide text-indigo-700">
                            Random Jokes Feed
                          </CardDescription>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase text-indigo-700">
                          <BookOpen
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Fresh Pull
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-zinc-700">{joke.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <span
                            key={`${joke.id}-${category}`}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryTheme(
                              category,
                            )}`}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-6">
              <Card className="border-indigo-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Readout</CardTitle>
                  <CardDescription>
                    Snapshot of what is showing on this page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-zinc-600">
                  <div className="flex items-center justify-between rounded-2xl bg-indigo-50/70 px-4 py-3">
                    <span>Categories seen</span>
                    <span className="font-semibold text-zinc-900">
                      {categoryCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-rose-50/70 px-4 py-3">
                    <span>Explicit jokes</span>
                    <span className="font-semibold text-zinc-900">
                      {explicitCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-sky-50/70 px-4 py-3">
                    <span>Per page</span>
                    <span className="font-semibold text-zinc-900">
                      {meta?.currentPageItems ?? jokes.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">Browsing tips</CardTitle>
                  <CardDescription>
                    Use the pager to sample new jokes and see the tags shift.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-600">
                  <p>
                    Want a fresh batch? Tap Next or Prev to keep the list
                    moving.
                  </p>
                  <p>
                    Categories highlight the tone. General jokes are the calm
                    baseline, while explicit tags signal mature content.
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
