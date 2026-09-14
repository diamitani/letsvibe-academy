import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const track = await db.videoTrack.findUnique({
    where: { slug },
    include: {
      videos: { orderBy: { position: "asc" } },
    },
  });

  if (!track) {
    notFound();
  }

  const videos = track.videos;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/tracks"
          className="text-sm font-semibold text-navy-700 hover:text-navy-900"
        >
          ← All tracks
        </Link>
        <div className="mt-4 max-w-3xl">
          <Badge tone="navy">
            {videos.length} video{videos.length === 1 ? "" : "s"}
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {track.title}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{track.description}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Video embeds in order */}
          <div className="flex flex-col gap-10">
            {videos.map((v, i) => (
              <div key={v.id} id={`video-${i}`} className="scroll-mt-24">
                <Card className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-navy-900">
                    <span className="mr-2 text-slate-400">{i + 1}.</span>
                    {v.title}
                  </h2>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  {v.creator ? <span>by {v.creator}</span> : null}
                  {v.duration ? <span>· {v.duration}</span> : null}
                </div>
                <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-navy-950">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                </Card>
              </div>
            ))}
            {videos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-lg font-semibold text-navy-900">
                  No videos in this track yet
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Check back soon — new videos are added regularly.
                </p>
              </div>
            ) : null}
          </div>

          {/* Playlist sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5">
              <h3 className="text-sm font-bold tracking-[0.12em] text-navy-900 uppercase">
                Playlist
              </h3>
              <ol className="mt-4 flex flex-col gap-1">
                {videos.map((v, i) => (
                  <li key={v.id}>
                    <a
                      href={`#video-${i}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-navy-50"
                    >
                      <span className="w-6 shrink-0 text-sm font-bold text-slate-400">
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-navy-900">
                          {v.title}
                        </span>
                        {v.duration ? (
                          <span className="block text-xs text-slate-500">
                            {v.duration}
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
