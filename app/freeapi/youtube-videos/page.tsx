import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  MessageCircle,
  PlayCircle,
  Sparkles,
  ThumbsUp,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type VideoThumbnail = {
  url: string;
  width: number;
  height: number;
};

type VideoSnippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default?: VideoThumbnail;
    medium?: VideoThumbnail;
    high?: VideoThumbnail;
    standard?: VideoThumbnail;
    maxres?: VideoThumbnail;
  };
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized?: {
    title: string;
    description: string;
  };
  defaultAudioLanguage?: string;
};

type VideoContentDetails = {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  projection: string;
};

type VideoStatistics = {
  viewCount: string;
  likeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
};

type VideoItem = {
  kind: string;
  id: string;
  snippet: VideoSnippet;
  contentDetails: VideoContentDetails;
  statistics: VideoStatistics;
};

type VideosApiResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: Array<{
      kind: string;
      items: VideoItem;
    }>;
  };
  message: string;
  success: boolean;
};

const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";
const MAX_TAGS = 3;
const LAST_UPDATED_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

async function getVideos(page: number) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        videos: [],
        meta: null,
        error: "Failed to fetch videos.",
      } as const;
    }

    const payload = (await response.json()) as VideosApiResponse;
    const meta = payload.data;
    const videos = meta.data.map((entry) => entry.items).filter(Boolean);

    return {
      videos,
      meta,
      error: null,
    } as const;
  } catch (_error) {
    return { videos: [], meta: null, error: "Unable to load videos." } as const;
  }
}

function formatNumber(value: string | number) {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(value, 10);
  if (Number.isNaN(numericValue)) {
    return "0";
  }
  return new Intl.NumberFormat("en-US").format(numericValue);
}

function formatDuration(isoDuration: string) {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/u.exec(isoDuration);
  if (!match) {
    return "--:--";
  }

  const hours = Number.parseInt(match[1] ?? "0", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const seconds = Number.parseInt(match[3] ?? "0", 10);

  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

function formatPublishedAt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getThumbnail(snippet: VideoSnippet) {
  return (
    snippet.thumbnails.maxres?.url ??
    snippet.thumbnails.standard?.url ??
    snippet.thumbnails.high?.url ??
    snippet.thumbnails.medium?.url ??
    snippet.thumbnails.default?.url ??
    ""
  );
}

function truncate(text: string, limit: number) {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trimEnd()}...`;
}

type VideosPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function YoutubeVideosPage({
  searchParams,
}: VideosPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.max(1, requestedPage);
  const { videos, meta, error } = await getVideos(currentPage);
  const lastUpdated = new Date().toLocaleString("en-GB", LAST_UPDATED_FORMAT);

  const totalViews = videos.reduce((total, video) => {
    return total + Number.parseInt(video.statistics.viewCount ?? "0", 10);
  }, 0);
  const hdCount = videos.filter(
    (video) => video.contentDetails.definition === "hd",
  ).length;
  const tags = videos.flatMap((video) => video.snippet.tags ?? []);
  const tagCounts = tags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  }, {});
  const topTags = Object.entries(tagCounts)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 4);

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_10%_15%,var(--videos-glow)_0%,#f7f6ff_38%,#f7fbff_100%)] px-4 py-8 sm:px-6 lg:px-10"
      style={
        {
          "--videos-glow": "#dbeafe",
          "--videos-ink": "#0f172a",
          "--videos-accent": "#ef4444",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,#fef3c7,transparent_70%)] opacity-70" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,#dbeafe,transparent_70%)] opacity-70" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#fee2e2,transparent_70%)] opacity-60" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
          Cohort Assignment Hub
        </div>

        <section className="video-fade-in rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Project
              </div>
              <h1
                className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--videos-ink)] sm:text-4xl"
                style={{ fontFamily: '"Space Grotesk", "Geist", sans-serif' }}
              >
                YouTube Videos Listing
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Scan a curated feed of FreeAPI-powered YouTube videos. Each card
                highlights channel details, watch time, engagement, and category
                context for quick browsing.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 text-xs text-slate-500 sm:items-end">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/freeapi" className="inline-flex">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back To FreeAPI
                  </Button>
                </Link>
                {meta && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase text-slate-600">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Page {meta.page} of {meta.totalPages}
                  </span>
                )}
              </div>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          {meta && (
            <div className="mt-6 grid gap-3 text-xs text-slate-600 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-slate-600">
                  Total Videos
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {meta.totalItems}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-slate-600">
                  Views (Page)
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatNumber(totalViews)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-slate-600">
                  HD Videos
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {hdCount} / {meta.currentPageItems}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-slate-600">
                  Tags Trending
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {topTags.length ? topTags[0][0] : "-"}
                </p>
              </div>
            </div>
          )}
        </section>

        {error ? (
          <Card className="border-rose-200 bg-rose-50/80">
            <CardHeader>
              <CardTitle>Unable to load videos</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1fr_0.35fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              {videos.map((video) => {
                const thumbnail = getThumbnail(video.snippet);
                const title = video.snippet.title;
                const channelTitle = video.snippet.channelTitle;
                const description = truncate(
                  video.snippet.description || "",
                  110,
                );
                const tagsList = (video.snippet.tags ?? []).slice(0, MAX_TAGS);
                const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

                return (
                  <Card
                    key={video.id}
                    className="overflow-hidden border-slate-100 bg-white/95 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={title}
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                          Thumbnail unavailable
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase text-white">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        {formatDuration(video.contentDetails.duration)}
                      </div>
                    </div>
                    <CardHeader className="space-y-3">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-rose-600">
                        <Video className="h-4 w-4" aria-hidden="true" />
                        {channelTitle}
                      </div>
                      <CardTitle className="text-base leading-snug text-slate-900">
                        {title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Published {formatPublishedAt(video.snippet.publishedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600">
                        {description || "Description not provided."}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                          <Eye className="h-3 w-3" aria-hidden="true" />
                          {formatNumber(video.statistics.viewCount)} views
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                          <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                          {formatNumber(video.statistics.likeCount ?? "0")}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                          <MessageCircle
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          {formatNumber(video.statistics.commentCount ?? "0")}
                        </span>
                      </div>
                      {tagsList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tagsList.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={videoUrl}
                          className="inline-flex"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" className="rounded-xl">
                            <PlayCircle
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            Watch on YouTube
                          </Button>
                        </Link>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {video.contentDetails.definition.toUpperCase()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <aside className="flex flex-col gap-4">
              <Card className="border-slate-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles
                      className="h-4 w-4 text-rose-500"
                      aria-hidden="true"
                    />
                    Feed Snapshot
                  </CardTitle>
                  <CardDescription>
                    Highlights from the current page of videos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Page Items
                    </span>
                    <span className="font-semibold text-slate-900">
                      {meta?.currentPageItems ?? videos.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Total Views
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatNumber(totalViews)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      HD Ratio
                    </span>
                    <span className="font-semibold text-slate-900">
                      {meta?.currentPageItems
                        ? `${hdCount}/${meta.currentPageItems}`
                        : hdCount}
                    </span>
                  </div>
                  {topTags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Popular Tags
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {topTags.map(([tag]) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-rose-100 bg-rose-50/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Video
                      className="h-4 w-4 text-rose-600"
                      aria-hidden="true"
                    />
                    Explore More
                  </CardTitle>
                  <CardDescription>
                    Use the paging controls to keep browsing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  {meta?.previousPage ? (
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
                  {meta?.nextPage ? (
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
                </CardContent>
              </Card>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
