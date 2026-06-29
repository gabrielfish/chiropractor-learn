import { algoliasearch } from "algoliasearch";

export const ALGOLIA_INDEX = "dcpg_content";

export function getSearchClient() {
  const appId = (import.meta.env.VITE_ALGOLIA_APP_ID as string | undefined) ?? "";
  const searchKey = (import.meta.env.VITE_ALGOLIA_SEARCH_KEY as string | undefined) ?? "";
  if (!appId || !searchKey) return null;
  return algoliasearch(appId, searchKey);
}

export interface AlgoliaHit {
  objectID: string;
  type: "content" | "course";
  id: string;
  title: string;
  description?: string | null;
  content_type?: string | null;
  thumbnail_url?: string | null;
  video_url?: string | null;
  pdf_url?: string | null;
  book_url?: string | null;
  display_author_name?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  tags?: string[];
}
