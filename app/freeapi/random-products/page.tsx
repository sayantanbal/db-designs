import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Boxes,
  CalendarDays,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type ProductsApiResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: Product[];
  };
  message: string;
  success: boolean;
};

const API_URL = "https://api.freeapi.app/api/v1/public/randomproducts";

async function getProducts(page: number) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        products: [],
        meta: null,
        error: "Failed to fetch products.",
      } as const;
    }

    const payload = (await response.json()) as ProductsApiResponse;
    const meta = payload.data;

    return {
      products: meta.data,
      meta,
      error: null,
    } as const;
  } catch (_error) {
    return { products: [], meta: null, error: "Unable to load products." } as const;
  }
}

type ProductsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const LAST_UPDATED_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export default async function RandomProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.max(1, requestedPage);
  const { products, meta, error } = await getProducts(currentPage);
  const lastUpdated = new Date().toLocaleString("en-GB", LAST_UPDATED_FORMAT);

  const categoryCounts = products.reduce<Record<string, number>>(
    (acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_10%_15%,#fdf5d5_0%,#f5fbff_40%,#f2f3ff_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,#ffe5bf,transparent_70%)] opacity-70" />
        <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,#cfe7ff,transparent_70%)] opacity-70" />
        <div className="absolute bottom-0 right-1/3 h-96 w-[32rem] translate-x-1/3 rounded-full bg-[radial-gradient(circle,#e3ddff,transparent_70%)] opacity-70" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Cohort Assignment Hub
        </div>

        <section className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Product Listing Interface
              </h1>
              <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
                Browse a curated selection of random products with pricing,
                discounts, ratings, and stock info in a clean storefront layout.
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
                {meta && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase text-amber-700">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Page {meta.page} of {meta.totalPages}
                  </span>
                )}
              </div>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          {meta && (
            <div className="mt-6 grid gap-3 text-xs text-zinc-600 sm:grid-cols-4">
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-amber-700">
                  Total Products
                </p>
                <p className="text-lg font-semibold text-zinc-900">
                  {meta.totalItems}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-amber-700">
                  Page Size
                </p>
                <p className="text-lg font-semibold text-zinc-900">
                  {meta.currentPageItems}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-amber-700">
                  Catalog Pages
                </p>
                <p className="text-lg font-semibold text-zinc-900">
                  {meta.totalPages}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-amber-700">
                  Active Page
                </p>
                <p className="text-lg font-semibold text-zinc-900">
                  {meta.page}
                </p>
              </div>
            </div>
          )}
        </section>

        {error ? (
          <Card className="border-rose-200 bg-rose-50/80">
            <CardHeader>
              <CardTitle>Unable to load products</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <section className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
                {products.length} items this page
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {topCategories.length > 0 ? (
                  topCategories.map(([category, count]) => (
                    <span
                      key={category}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase text-slate-600"
                    >
                      {category} ({count})
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">
                    Category insights appear here.
                  </span>
                )}
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const discountedPrice = Math.max(
                  0,
                  product.price - product.price * (product.discountPercentage / 100),
                );

                return (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border-amber-100 bg-white/90"
                  >
                    <div className="relative">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                        <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
                        Save {product.discountPercentage.toFixed(0)}%
                      </div>
                    </div>
                    <CardHeader className="gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">
                            {product.title}
                          </CardTitle>
                          <CardDescription>
                            {product.brand} · {product.category}
                          </CardDescription>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <Star className="h-3.5 w-3.5" aria-hidden="true" />
                          {product.rating.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600">
                        {product.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase text-zinc-400">
                            Price
                          </p>
                          <p className="text-xl font-semibold text-zinc-900">
                            ${discountedPrice.toFixed(0)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            <span className="line-through">
                              ${product.price.toFixed(0)}
                            </span>{" "}
                            before discount
                          </p>
                        </div>
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                          {product.stock} in stock
                        </div>
                      </div>
                      <Button className="w-full rounded-xl" variant="outline">
                        View details
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </section>

            {meta && (
              <section className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Page {meta.page}
                </span>
                <div className="flex items-center gap-2">
                  {meta.previousPage ? (
                    <Link href={`?page=${meta.page - 1}`} className="inline-flex">
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
                    <Link href={`?page=${meta.page + 1}`} className="inline-flex">
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
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
