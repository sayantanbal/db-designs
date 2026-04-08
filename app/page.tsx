import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { Button as HeroButton } from "@heroui/react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[linear-gradient(120deg,#f0f9ff_0%,#f7f7fb_42%,#f1f5f9_100%)] px-4 py-10 sm:px-6">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-5 rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Database className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Assignment Portfolio
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          Open your cohort database assignment index and launch each project from a
          responsive dashboard.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/db" className="inline-flex">
            <Button size="lg">
              Go To DB Assignments
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <HeroButton size="sm" variant="secondary" isDisabled>
            More Sections Coming Soon
          </HeroButton>
        </div>
      </section>
    </main>
  );
}
