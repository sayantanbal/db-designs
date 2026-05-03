import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RandomUser = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number | string;
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  id: number;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
};

type RandomUsersApiResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: RandomUser[];
  };
  message: string;
  success: boolean;
};

const API_URL = "https://api.freeapi.app/api/v1/public/randomusers";

async function getRandomUsers(page: number) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        users: [],
        meta: null,
        error: "Failed to fetch users.",
      } as const;
    }

    const payload = (await response.json()) as RandomUsersApiResponse;
    const meta = payload.data;

    return {
      users: meta.data,
      meta,
      error: null,
    } as const;
  } catch (_error) {
    return { users: [], meta: null, error: "Unable to load users." } as const;
  }
}

type RandomUsersPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function RandomUsersPage({
  searchParams,
}: RandomUsersPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.max(1, requestedPage);
  const { users, meta, error } = await getRandomUsers(currentPage);
  const lastUpdated = new Date();
  const formattedLastUpdated = lastUpdated.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_80%_10%,#eaf4ff_0%,#f7f7fb_35%,#fff7f2_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Cohort Assignment Hub
        </div>
        <section className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Random Users UI
              </h1>
              <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
                Browse live user profiles from the Random Users API. Each card
                highlights contact details, location, and registration age.
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
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-sky-700">
                    Page
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.page} / {meta.totalPages}
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-sky-700">
                    Total Users
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.totalItems}
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-amber-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase text-amber-700">
                    Current Page
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {meta.currentPageItems} users
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Page {meta.page}
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
              <CardTitle>Unable to load data</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => {
              const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
              const location = `${user.location.city}, ${user.location.state}`;
              const street = `${user.location.street.number} ${user.location.street.name}`;

              return (
                <Card key={user.id} className="overflow-hidden border-sky-100">
                  <CardHeader className="flex-row items-center gap-4">
                    <img
                      src={user.picture.medium}
                      alt={fullName}
                      className="h-16 w-16 rounded-2xl border border-zinc-200 object-cover"
                    />
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{fullName}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wide text-sky-700">
                        {user.gender} · {user.nat}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-zinc-600">
                      <p className="flex items-center gap-2">
                        <Mail
                          className="h-4 w-4 text-sky-500"
                          aria-hidden="true"
                        />
                        {user.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone
                          className="h-4 w-4 text-sky-500"
                          aria-hidden="true"
                        />
                        {user.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin
                          className="h-4 w-4 text-sky-500"
                          aria-hidden="true"
                        />
                        {street}, {location}
                      </p>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          className="h-4 w-4 text-amber-500"
                          aria-hidden="true"
                        />
                        Age {user.dob.age}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide">
                        {user.location.country}
                      </span>
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
