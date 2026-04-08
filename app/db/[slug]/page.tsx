import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getDbProjectBySlug } from "@/lib/db-projects";

type DbProjectViewerPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DbProjectViewerPage({ params }: DbProjectViewerPageProps) {
  const { slug } = await params;
  const project = getDbProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const sourcePath = `/db/projects/${project.slug}/index.html`;

  return (
    <main className="min-h-dvh bg-zinc-100 px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
        <section className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                DB Assignment
              </p>
              <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">
                {project.name}
              </h1>
            </div>

            <Link
              href="/db"
              className="inline-flex items-center gap-2 rounded-full bg-black py-1 pl-1 pr-5 text-white shadow-md transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <ChevronLeft className="h-6 w-6 text-black" aria-hidden="true" />
              </span>
              <span className="text-lg font-black uppercase tracking-wide">Back</span>
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <iframe
            title={`${project.name} assignment preview`}
            src={sourcePath}
            className="h-[calc(100dvh-190px)] w-full bg-white"
          />
        </section>
      </div>
    </main>
  );
}