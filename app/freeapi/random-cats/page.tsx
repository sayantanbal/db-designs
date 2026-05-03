"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Heart,
  MapPin,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Cat = {
  id: number;
  name: string;
  origin: string;
  temperament: string;
  description: string;
  life_span: string;
  weight: {
    imperial: string;
    metric: string;
  };
  image: string;
  wikipedia_url?: string;
  vetstreet_url?: string;
};

type CatApiResponse = {
  statusCode: number;
  data: Cat;
  message: string;
  success: boolean;
};

const API_URL = "https://api.freeapi.app/api/v1/public/cats/cat/random";

const LAST_UPDATED_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export default function RandomCatsPage() {
  const [cat, setCat] = useState<Cat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchCat = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Failed to fetch cat.");
      }

      const payload = (await response.json()) as CatApiResponse;

      if (!payload?.success) {
        throw new Error(payload?.message || "Unable to fetch a cat right now.");
      }

      setCat(payload.data);
      setLastUpdated(new Date().toLocaleString("en-GB", LAST_UPDATED_FORMAT));
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to fetch a cat right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCat();
  }, [fetchCat]);

  const traits = cat?.temperament
    ? cat.temperament
        .split(",")
        .map((trait) => trait.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];
  const wikipediaUrl = cat?.wikipedia_url;
  const vetstreetUrl = cat?.vetstreet_url;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#fcded1_0%,#fff7f2_42%,#f5f7ff_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-14 h-64 w-64 rounded-full bg-[radial-gradient(circle,#fbd6e7,transparent_70%)] opacity-70" />
        <div className="absolute right-8 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,#fce7c3,transparent_70%)] opacity-70" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#e0f2fe,transparent_70%)] opacity-70" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
          Cohort Assignment Hub
        </div>

        <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Random Cat Viewer
              </h1>
              <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
                Meet a new cat breed with every fetch. Tap the button to refresh
                the portrait and browse key traits, origins, and temperament.
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
                <Button
                  onClick={fetchCat}
                  disabled={loading}
                  size="sm"
                  className="bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  {loading ? "Fetching..." : "New Cat"}
                </Button>
              </div>
              <span>
                {lastUpdated
                  ? `Last updated: ${lastUpdated}`
                  : "Ready to fetch"}
              </span>
            </div>
          </div>
        </section>

        {error ? (
          <Card className="border-rose-200 bg-rose-50/80">
            <CardHeader>
              <CardTitle>Unable to load a cat</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="overflow-hidden border-rose-100">
              <div className="relative">
                {cat?.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-72 w-full object-cover sm:h-96"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center bg-rose-50 text-sm text-rose-500 sm:h-96">
                    Fetching a cat portrait...
                  </div>
                )}
                {cat?.origin && (
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {cat.origin}
                  </div>
                )}
              </div>
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">
                      {cat?.name ?? "Finding a cat..."}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs uppercase tracking-wide text-rose-700">
                      {cat?.life_span ? `Life span ${cat.life_span} years` : ""}
                    </CardDescription>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase text-rose-700">
                    <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                    Cat Profile
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-600">
                  {cat?.description ??
                    "Each fetch delivers a new breed profile with its key traits."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {traits.length > 0 ? (
                    traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                      >
                        {trait}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400">
                      Temperament details appear here.
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="border-rose-100">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                  <CardDescription>
                    Key information at a glance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-zinc-600">
                  <div className="flex items-center justify-between rounded-2xl bg-rose-50/70 px-4 py-3">
                    <span className="font-semibold text-rose-700">Weight</span>
                    <span>
                      {cat?.weight
                        ? `${cat.weight.metric} kg / ${cat.weight.imperial} lb`
                        : "Loading"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span className="font-semibold text-rose-700">Origin</span>
                    <span>{cat?.origin ?? "Loading"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-rose-50/70 px-4 py-3">
                    <span className="flex items-center gap-2 font-semibold text-rose-700">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      Life span
                    </span>
                    <span>
                      {cat?.life_span ? `${cat.life_span} years` : "Loading"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-100">
                <CardHeader>
                  <CardTitle className="text-lg">Learn More</CardTitle>
                  <CardDescription>
                    External links for deeper reading.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {wikipediaUrl ? (
                    <a
                      className="inline-flex items-center justify-between rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-200 hover:bg-rose-50"
                      href={wikipediaUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Wikipedia
                      <span className="text-xs text-rose-400">
                        Opens new tab
                      </span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm font-semibold text-rose-400">
                      Wikipedia
                      <span className="text-xs">Unavailable</span>
                    </div>
                  )}
                  {vetstreetUrl ? (
                    <a
                      className="inline-flex items-center justify-between rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-200 hover:bg-rose-50"
                      href={vetstreetUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Vetstreet
                      <span className="text-xs text-rose-400">
                        Opens new tab
                      </span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm font-semibold text-rose-400">
                      Vetstreet
                      <span className="text-xs">Unavailable</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
