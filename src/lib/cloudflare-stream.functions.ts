import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Request a Cloudflare Stream direct-creator upload URL.
 * The browser then uploads the video file directly to Cloudflare (no server bandwidth used).
 * Returns { uploadUrl, videoId } — store videoId in the DB, use uploadUrl for the PUT request.
 */
export const getCloudflareUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const token = process.env.CLOUDFLARE_STREAM_TOKEN;

    if (!accountId || !token) {
      throw new Error(
        "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_TOKEN must be set in environment variables"
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: 21600, // 6 hours max
          requireSignedURLs: false,
          allowedOrigins: ["learn.dcpracticegrowth.com", "localhost"],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudflare API error ${response.status}: ${text}`);
    }

    const json = (await response.json()) as {
      result?: { uploadURL: string; uid: string };
      success: boolean;
      errors?: { message: string }[];
    };

    if (!json.success || !json.result) {
      const msg = json.errors?.map((e) => e.message).join("; ") ?? "Unknown error";
      throw new Error(`Cloudflare direct upload failed: ${msg}`);
    }

    return {
      uploadUrl: json.result.uploadURL,
      videoId: json.result.uid,
    };
  });
