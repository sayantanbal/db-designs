import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChefHat,
  CirclePlay,
  Globe2,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strIngredient16: string | null;
  strIngredient17: string | null;
  strIngredient18: string | null;
  strIngredient19: string | null;
  strIngredient20: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strMeasure16: string | null;
  strMeasure17: string | null;
  strMeasure18: string | null;
  strMeasure19: string | null;
  strMeasure20: string | null;
};

type MealsApiResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: Meal[];
  };
  message: string;
  success: boolean;
};

type MealIngredient = {
  ingredient: string;
  measure: string;
};

const API_URL = "https://api.freeapi.app/api/v1/public/meals";
const MAX_INGREDIENTS = 6;
const MAX_INSTRUCTIONS = 170;

async function getMeals(page: number) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        meals: [],
        meta: null,
        error: "Failed to fetch meals.",
      } as const;
    }

    const payload = (await response.json()) as MealsApiResponse;
    const meta = payload.data;

    return {
      meals: meta.data,
      meta,
      error: null,
    } as const;
  } catch (_error) {
    return { meals: [], meta: null, error: "Unable to load meals." } as const;
  }
}

function getMealIngredients(meal: Meal): MealIngredient[] {
  const items: MealIngredient[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredientKey = `strIngredient${index}` as keyof Meal;
    const measureKey = `strMeasure${index}` as keyof Meal;
    const ingredient = meal[ingredientKey];
    const measure = meal[measureKey];

    if (typeof ingredient === "string" && ingredient.trim().length > 0) {
      items.push({
        ingredient: ingredient.trim(),
        measure: typeof measure === "string" ? measure.trim() : "",
      });
    }
  }

  return items;
}

function truncate(text: string, limit: number) {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trimEnd()}...`;
}

type MealsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function MealsPage({ searchParams }: MealsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.max(1, requestedPage);
  const { meals, meta, error } = await getMeals(currentPage);
  const lastUpdated = new Date();
  const formattedLastUpdated = lastUpdated.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const categoryCount = new Set(
    meals.map((meal) => meal.strCategory).filter(Boolean),
  ).size;
  const areaCount = new Set(meals.map((meal) => meal.strArea).filter(Boolean))
    .size;

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_10%_10%,var(--meals-glow)_0%,#fff7ed_45%,#fef2c6_100%)] px-4 py-8 sm:px-6 lg:px-10"
      style={
        {
          "--meals-glow": "#fde7d2",
          "--meals-ember": "#f59e0b",
          "--meals-ink": "#1f2937",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,#fde68a,transparent_70%)] opacity-70" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,#fdba74,transparent_70%)] opacity-60" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#fff7ed,transparent_70%)] opacity-70" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Cohort Assignment Hub
        </div>
        <section className="meals-fade-in rounded-3xl border border-amber-100 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                <ChefHat className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--meals-ink)] sm:text-4xl">
                Meals Listing Interface
              </h1>
              <p className="max-w-2xl text-sm text-zinc-700 sm:text-base">
                Explore a curated list of meals with categories, cuisine
                origins, and quick ingredient snapshots. Designed for quick
                scanning and confident browsing.
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
                <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-amber-800">
                    Meals In Catalog
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.totalItems}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-orange-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-amber-800">
                    Categories
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {categoryCount} categories / {areaCount} cuisines
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
              <CardTitle>Unable to load meals</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {meals.map((meal, index) => {
              const ingredients = getMealIngredients(meal).slice(
                0,
                MAX_INGREDIENTS,
              );
              const tags = meal.strTags
                ? meal.strTags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [];

              return (
                <Card
                  key={meal.idMeal}
                  className="meals-card overflow-hidden border-amber-100"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="relative">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      {meal.strCategory}
                    </div>
                  </div>
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">
                          {meal.strMeal}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2 text-xs uppercase tracking-wide text-amber-800">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {meal.strArea}
                        </CardDescription>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase text-amber-800">
                        <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Meal
                      </div>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[11px] font-semibold uppercase text-orange-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-600">
                      {truncate(meal.strInstructions, MAX_INSTRUCTIONS)}
                    </p>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-xs text-zinc-700">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase text-amber-800">
                        <BookOpen className="h-3.5 w-3.5" />
                        Ingredients snapshot
                      </div>
                      <ul className="space-y-1">
                        {ingredients.map((item) => (
                          <li key={`${meal.idMeal}-${item.ingredient}`}>
                            {item.ingredient}
                            {item.measure ? ` - ${item.measure}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <CalendarDays className="h-4 w-4 text-amber-700" />
                        {meta?.currentPageItems ?? meals.length} meals on this
                        page
                      </div>
                      <div className="flex items-center gap-2">
                        {meal.strSource ? (
                          <a
                            href={meal.strSource}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex"
                          >
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4" />
                              Source
                            </Button>
                          </a>
                        ) : null}
                        {meal.strYoutube ? (
                          <a
                            href={meal.strYoutube}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex"
                          >
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-500"
                            >
                              <CirclePlay className="h-4 w-4" />
                              Video
                            </Button>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
