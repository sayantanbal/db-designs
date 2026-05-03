import Link from "next/link";
import { ArrowRight, CircleCheckBig, Globe2, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FreeApiProject = {
  slug: string;
  title: string;
  cohort: string;
  timeline: string;
  description: string;
  status: string;
};

const freeApiProjects: FreeApiProject[] = [
  {
    slug: "random-users",
    title: "Random Users UI",
    cohort: "Web Dev Cohort 2026",
    timeline: "May 2 - May 3, 2026",
    description:
      "Fetch and display user profiles from the Random Users API in a clean, card-based layout.",
    status: "Done",
  },
];

export default function FreeApiAssignmentsPage() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_15%_10%,#e6f9ff_0%,#f7fbff_38%,#f6f2ff_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                FreeAPI Track
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                FreeAPI Assignments
              </h1>
              <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
                Live builds created from the FreeAPI challenge prompts. Each
                project focuses on API reading, data shaping, and UI craft.
              </p>
            </div>

            <Link href="/" className="inline-flex">
              <Button variant="outline" size="sm">
                Back To Home
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {freeApiProjects.map((project) => (
            <Card key={project.slug} className="border-sky-100 bg-white/90">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <Globe2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.cohort}</CardDescription>
                <CardDescription>{project.timeline}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-600">{project.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/freeapi/${project.slug}`}
                    className="inline-flex"
                  >
                    <Button className="rounded-xl">
                      Open Project
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <CircleCheckBig className="h-3.5 w-3.5" aria-hidden="true" />
                    {project.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
