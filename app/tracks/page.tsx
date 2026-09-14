import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export default async function TracksPage() {
  const tracks = await db.videoTrack.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { videos: true } },
    },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Video tracks"
          title="Follow along as real builders ship"
          description="Curated video playlists, ordered step by step — watch a whole track in order or jump to the video you need."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t, i) => (
            <Link key={t.id} href={`/tracks/${t.slug}`}>
              <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.18em] text-sky-600 uppercase">
                    Track {i + 1}
                  </span>
                  <Badge tone="navy">
                    {t._count.videos} video{t._count.videos === 1 ? "" : "s"}
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-bold text-navy-900">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {t.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-navy-700">
                  Watch track →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
