import {
  useEffect,
  useState,
} from "react"

import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  LANGUAGES,
  TYPE,
} from "@/meetingTypes"
import { fetchData } from "@/utils/meetings-utils"

export interface FacetOptions {
    TYPES: Record<string, string>
    FORMATS: Record<string, string>
    FEATURES: Record<string, string>
    COMMUNITIES: Record<string, string>
    LANGUAGES: Record<string, string>
  }

  interface FacetCodeDesc { code: string; desc: string }
  interface FacetsResponse {
    categories?: {
      communities?: FacetCodeDesc[]
      features?: FacetCodeDesc[]
      formats?: FacetCodeDesc[]
      type?: FacetCodeDesc[]
    }
    languages?: {
      English: string
      alpha2: string
    }[]
  }

  const fallbackFacetOptions: FacetOptions = {
    TYPES: TYPE,
    FORMATS: FORMATS,
    FEATURES: FEATURES,
    COMMUNITIES: COMMUNITIES,
    LANGUAGES: LANGUAGES,
  }

  const facetsToRecord = (facets?: FacetCodeDesc[]) =>
    (facets ?? []).reduce<Record<string, string>>((acc, { code, desc }) => {
      if (code) acc[code] = desc
      return acc
    }, {})

  const normalizeLanguage = (englishName: string) =>
    englishName.split(";")[0]?.trim() || englishName

  const mapFacets = (raw: FacetsResponse): FacetOptions => {
    const cats = raw.categories ?? {}
    const LANGUAGES = Object.fromEntries(
      (raw.languages ?? [])
        .filter(lang => lang.alpha2)
        .map(lang => [lang.alpha2, normalizeLanguage(lang.English)])
        .sort((a, b) => a[1].localeCompare(b[1]))
    ) as Record<string, string>
    
    return {
      TYPES:      facetsToRecord(cats.type),
      FORMATS:    facetsToRecord(cats.formats),
      FEATURES:   facetsToRecord(cats.features),
      COMMUNITIES:facetsToRecord(cats.communities),
      LANGUAGES,
    }
  }

  export function useFacets(): { facetOptions: FacetOptions, loading: boolean, error?: Error } {
    const [facetOptions, setFacetOptions] = useState<FacetOptions>(fallbackFacetOptions)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>(undefined)

    useEffect(() => {
      let cancelled = false
      async function fetchFacets() {
        try {
          console.log("Facet fetch started");
          const url = import.meta.env.VITE_CQ_FACETS_URL as string;
          if (!url) throw new Error("VITE_CQ_FACETS_URL not set");
          const raw = await fetchData<FacetsResponse>(url);
          console.log("Facet fetch response:", raw);
          // Treat empty array (from fetchData error) as an error
          if (Array.isArray(raw) && raw.length === 0) {
            throw new Error("Facet response is empty (fetchData error)");
          }
          console.log("Facet fetch succeeded");
          if (!cancelled) {
            setFacetOptions(mapFacets(raw));
            setLoading(false);
          }
        } catch (e) {
          console.error("Facet fetch error:", e);
          if (!cancelled) {
            setError(e instanceof Error ? e : new Error(String(e)));
            setFacetOptions(fallbackFacetOptions);
            setLoading(false);
          }
        }
      }
      void fetchFacets()
      return () => { cancelled = true }
    }, [])

    return { facetOptions, loading, error }
  }
