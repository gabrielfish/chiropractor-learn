/**
 * VideoPlayer — renders the right player based on what's available:
 * 1. Cloudflare Stream  (cloudflareVideoId is set)
 * 2. YouTube embed      (videoUrl matches youtube.com / youtu.be)
 * 3. Raw video file     (videoUrl is any other URL)
 * 4. Empty placeholder
 */

const CF_CUSTOMER = "customer-3ojbg1863az";

export function cfThumbnail(videoId: string): string {
  return `https://${CF_CUSTOMER}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
}

interface VideoPlayerProps {
  cloudflareVideoId?: string | null;
  videoUrl?: string | null;
  title?: string;
  posterUrl?: string | null;
  className?: string;
}

function youtubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
}

function isYoutube(url: string | null | undefined): boolean {
  return !!url && /(?:youtube\.com|youtu\.be)/.test(url);
}

export function VideoPlayer({
  cloudflareVideoId,
  videoUrl,
  title = "Video",
  posterUrl,
  className = "",
}: VideoPlayerProps) {
  const wrapClass = `aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card ${className}`;

  // 1. Cloudflare Stream
  if (cloudflareVideoId) {
    const cfPoster = posterUrl ?? cfThumbnail(cloudflareVideoId);
    return (
      <div className={wrapClass} style={cfPoster ? { backgroundImage: `url(${cfPoster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        <iframe
          src={`https://iframe.cloudflarestream.com/${cloudflareVideoId}`}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // 2. YouTube
  const ytEmbed = youtubeEmbed(videoUrl);
  if (ytEmbed) {
    return (
      <div className={wrapClass}>
        <iframe
          src={ytEmbed}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // 3. Raw video file (Supabase storage upload)
  if (videoUrl && !isYoutube(videoUrl)) {
    return (
      <div className={wrapClass}>
        <video
          src={videoUrl}
          controls
          playsInline
          poster={posterUrl ?? undefined}
          className="w-full h-full"
          controlsList="nodownload"
        />
      </div>
    );
  }

  // 4. No video
  return (
    <div className={`${wrapClass} flex items-center justify-center`}>
      <p className="text-muted-foreground text-sm">No video for this lesson</p>
    </div>
  );
}
