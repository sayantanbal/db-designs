import Link from "next/link";
import { ArrowRight, Database, FolderOpen } from "lucide-react";
import { Button as HeroButton, Chip } from "@heroui/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDbProjects } from "@/lib/db-projects";

export default function DbAssignmentsPage() {
  const projects = getDbProjects();

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_10%_10%,#d8f4ff_0%,#f7fcff_38%,#f5f6f8_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-sky-100 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <Chip color="default" size="sm" variant="secondary">
                Cohort Assignment Hub
              </Chip>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                Database Diagram Assignments
              </h1>
              <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
                Select a project to open the live assignment view. All project files are
                served directly from your attached HTML/CSS bundles.
              </p>
            </div>

            <Link href="/" className="inline-flex">
              <HeroButton size="sm" variant="secondary">
                Back To Home
              </HeroButton>
            </Link>
          </div>
        </section>

        {projects.length === 0 ? (
          <Card className="border-dashed border-zinc-300 bg-white/80">
            <CardHeader>
              <CardTitle>No Assignments Found</CardTitle>
              <CardDescription>
                Add folders under app with an index.html file, then refresh this page.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.slug} className="border-zinc-200 bg-white/85">
                <CardHeader>
                  <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Database className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    Slug: {project.slug}
                  </CardDescription>
                  <CardDescription>
                    Submitted: {project.submittedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <Link href={`/db/${project.slug}`} className="inline-flex">
                    <Button className="rounded-xl">
                      Open Project
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <FolderOpen className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}